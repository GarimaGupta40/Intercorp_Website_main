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
      // Log detailed DB error for server-side diagnosis but return generic error to client
      console.error('[Contact] MySQL error inserting message:', dbErr.message || dbErr);
      if (dbErr.code) console.error('[Contact] MySQL error code:', dbErr.code);
      if (dbErr.sqlMessage) console.error('[Contact] MySQL sqlMessage:', dbErr.sqlMessage);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[Contact] Unexpected error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Health check for contact DB access (useful in production to verify DB connectivity)
router.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1 as ok');
    if (rows && rows.length) return res.json({ success: true });
    return res.status(500).json({ error: 'Database error' });
  } catch (dbErr) {
    console.error('[Contact][Health] DB check failed:', dbErr.message || dbErr);
    return res.status(500).json({ error: 'Database error' });
  }
});

export default router;
