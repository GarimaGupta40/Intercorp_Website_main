import express from "express";
import razorpay from "../config/razorpay.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Razorpay order creation failed" });
  }
});

export default router;
