import express from "express";
import crypto from "crypto";
import pool from "../db/db.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment fields' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false });
    }

    // Ensure we have order data to persist
    if (!orderData) {
      return res.status(400).json({ success: false, error: 'Missing order data' });
    }

    const order = orderData;

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
    } catch (insErr) {
      console.warn('Insert with payment columns failed, falling back:', insErr && insErr.code ? insErr.code : insErr);

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

      // Try to add payment columns (safe if they already exist will error)
      try {
        await pool.execute(`ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending'`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_order_id VARCHAR(100) NULL`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_payment_id VARCHAR(100) NULL`);
        await pool.execute(`ALTER TABLE orders ADD COLUMN razorpay_signature VARCHAR(255) NULL`);
      } catch (alterErr) {
        // If alter fails, log and continue — columns may already exist
        console.warn('ALTER TABLE for payment columns failed or columns already exist:', alterErr && alterErr.code ? alterErr.code : alterErr);
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
      } catch (updErr) {
        console.warn('Failed to update payment columns after fallback insert:', updErr && updErr.code ? updErr.code : updErr);
      }
    }

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

export default router;
