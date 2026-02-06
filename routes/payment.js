import express from "express";
import razorpay from "../config/razorpay.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      console.error('[Payment] Invalid amount:', amount);
      return res.status(400).json({ 
        success: false, 
        error: "Invalid amount" 
      });
    }

    console.log('[Payment] Creating Razorpay order with amount:', amount);
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    console.log('[Payment] Razorpay order created successfully:', order.id);
    
    const response = {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
    
    console.log('[Payment] Sending response with key_id prefix:', process.env.RAZORPAY_KEY_ID?.substring(0, 10) + '...');
    
    res.json(response);
  } catch (err) {
    console.error('[Payment] Error creating Razorpay order:', err.message || err);
    res.status(500).json({ 
      success: false, 
      error: "Razorpay order creation failed: " + (err.message || 'Unknown error')
    });
  }
});

export default router;
