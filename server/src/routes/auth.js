import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// For now - single admin user. Later DB.
const USER = {
  email: 'admin@bajfaj.com',
  passwordHash: bcrypt.hashSync('Admin123!', 10)
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email!== USER.email) return res.status(401).json({message: 'Invalid creds'});

  const ok = await bcrypt.compare(password, USER.passwordHash);
  if (!ok) return res.status(401).json({message: 'Invalid creds'});

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'bajfaj_secret_dev', { expiresIn: '1d' });
  res.json({ token, email });
});

export default router;