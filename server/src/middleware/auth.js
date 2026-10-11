import jwt from 'jsonwebtoken';

export const blacklist = new Set();

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  // Check if token was logged out
  if (blacklist.has(token)) {
    return res.status(401).json({ message: 'Token invalidated' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}