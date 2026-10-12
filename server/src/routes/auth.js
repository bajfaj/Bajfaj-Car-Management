import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import db from '../../database.js';
import { authMiddleware, blacklist } from '../middleware/auth.js';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required').pipe(z.email('Invalid email format')),
  password: z.string().min(1, 'Password is required')
});

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: (parsed.error.issues || parsed.error.errors).map(e => e.message)
    });
  }
  const { email, password } = parsed.data;
  const normalizedEmail = email; // already trimmed + lowercased by zod

  db.get('SELECT * FROM users WHERE email =?', [normalizedEmail], async (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, jti: `${Date.now()}-${Math.random()}` },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, email: user.email });
  });
});

router.post('/logout', authMiddleware, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  blacklist.add(token);
  setTimeout(() => blacklist.delete(token), 24 * 60 * 60 * 1000);
  res.status(200).json({ message: 'Logged out' });
});

export default router;