const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Registration - Phone number nahi chahiye (Email & Username only)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExist = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Username ya Email pehle se exists karta hai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, avatar_url',
      [username, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET || 'raahi_secret_key',
      { expiresIn: '30d' }
    );

    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: 'User nahi mila' });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Galat password' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'raahi_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar_url: user.avatar_url }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
