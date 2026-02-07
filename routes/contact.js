import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

function sqlDate(date = new Date()) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body || {};

    // Validate required fields: firstName, lastName, email, message
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    try {
      await pool.execute(
        `INSERT INTO contact_messages (firstName, lastName, email, phone, subject, message, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName || '', email, phone || '', subject || '', message, sqlDate()]
      );
    } catch (dbErr) {
      console.error('[Contact] MySQL error inserting message:', dbErr);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[Contact] Unexpected error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

export default router;
