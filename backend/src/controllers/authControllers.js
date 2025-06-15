import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/db.connect.js';

export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username',
      [username, email, hashed]
    );
    const { id, username: savedUsername } = result.rows[0];
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id, username: savedUsername } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error registering user' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE email = $1',
      [email]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { id, username, password: hashed } = result.rows[0];
    const ok = await bcrypt.compare(password, hashed);
    if (!ok) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id, username } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error logging in' });
  }
}
