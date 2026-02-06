import express from "express";
import crypto from "crypto";
import pool from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    console.log('[PaymentVerify] Received verification request for order:', razorpay_order_id);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('[PaymentVerify] Missing payment fields:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return res.status(400).json({ success: false, error: 'Missing payment fields' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('[PaymentVerify] RAZORPAY_KEY_SECRET not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log('[PaymentVerify] Signature verification - Expected:', expectedSignature.substring(0, 20) + '...', 'Received:', razorpay_signature.substring(0, 20) + '...');

    if (expectedSignature !== razorpay_signature) {
      console.error('[PaymentVerify] Signature mismatch - Payment might be fraudulent');
      return res.json({ success: false, error: 'Signature verification failed' });
    }

    console.log('[PaymentVerify] Signature verified successfully');

    // Ensure we have order data to persist
    if (!orderData) {
      console.error('[PaymentVerify] Missing order data in request');
      return res.status(400).json({ success: false, error: 'Missing order data' });
    }

    const order = orderData;
    console.log('[PaymentVerify] Saving order to database:', order.id);

    // Try inserting with payment columns. If DB is missing those columns, fall back
    // to inserting without them and then add/update the payment columns.
    try {
      await pool.execute(
        `INSERT INTO orders 
        (id, customerName, email, phone, address, pincode, items, total, discount, paymentMethod, status, date, payment_status, razorpay_order_id, razorpay_payment_id, razorpay_signature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.customerName || '',
          order.email || '',
          order.phone || '',
          order.address || '',
          order.pincode || '',
          JSON.stringify(order.items || []),
          order.total || 0,
          order.discount || 0,
          "Online Payment",
          "Confirmed",
          new Date().toISOString(),
          "done",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        ]
      );
      console.log('[PaymentVerify] Order saved with payment columns successfully');
    } catch (insErr) {
      console.warn('[PaymentVerify] Insert with payment columns failed, falling back:', insErr && insErr.code ? insErr.code : insErr.message);

      // Insert without payment-specific columns
      await pool.execute(
        `INSERT INTO orders 
        (id, customerName, email, phone, address, pincode, items, total, discount, paymentMethod, status, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.customerName || '',
          order.email || '',
          order.phone || '',
          order.address || '',
          order.pincode || '',
          JSON.stringify(order.items || []),
          order.total || 0,
          order.discount || 0,
          "Online Payment",
          "Confirmed",
          new Date().toISOString()
        ]
      );
      console.log('[PaymentVerify] Order saved without payment columns, attempting to add columns');

      // Try to add payment columns (safe if they already exist will error)
      try {
        await pool.execute(`ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending'`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_order_id VARCHAR(100) NULL`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_payment_id VARCHAR(100) NULL`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_signature VARCHAR(255) NULL`);
        console.log('[PaymentVerify] Payment columns added to orders table');
      } catch (alterErr) {
        // If alter fails, log and continue — columns may already exist
        console.log('[PaymentVerify] ALTER TABLE for payment columns skipped (columns likely exist):', alterErr && alterErr.code ? alterErr.code : alterErr.message);
      }

      // Update the inserted row to set payment status and razorpay ids if columns exist
      try {
        await pool.execute(
          `UPDATE orders SET payment_status = ?, razorpay_order_id = ?, razorpay_payment_id = ?, razorpay_signature = ? WHERE id = ?`,
          [
            'done',
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order.id
          ]
        );
        console.log('[PaymentVerify] Payment details updated successfully');
      } catch (updErr) {
        console.warn('[PaymentVerify] Failed to update payment columns after fallback insert:', updErr && updErr.code ? updErr.code : updErr.message);
      }
    }

    console.log('[PaymentVerify] Payment verification and order saving completed successfully');
    res.json({ success: true, orderId: order.id });

  } catch (err) {
    console.error('[PaymentVerify] Error during payment verification:', err.message || err);
    res.status(500).json({ success: false, error: err.message || 'Payment verification error' });
  }
});

export default router;
