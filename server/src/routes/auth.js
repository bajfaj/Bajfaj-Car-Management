import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../../database.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email ||!password) return res.status(400).json({ message: 'Email and password required' });

  db.get('SELECT * FROM users WHERE email =?', [email.trim().toLowerCase()], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email });
  });
});

export default router;