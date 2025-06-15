import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId ?? payload.id };
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}