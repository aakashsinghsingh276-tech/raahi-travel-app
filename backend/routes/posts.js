const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get All Posts with User info
router.get('/', async (req, res) => {
  try {
    const posts = await pool.query(`
      SELECT p.*, u.username, u.avatar_url,
      (SELECT COUNT(*)::int FROM likes WHERE post_id = p.id) as likes_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Post
router.post('/create', async (req, res) => {
  const { userId, title, location, image_url, caption, lat, lng } = req.body;
  try {
    const newPost = await pool.query(
      'INSERT INTO posts (user_id, title, location, image_url, caption, lat, lng) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, title || '', location, image_url, caption || '', lat || 0, lng || 0]
    );
    res.json(newPost.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save Post to Itinerary Toggle
router.post('/save', async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const check = await pool.query('SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2', [userId, postId]);
    if (check.rows.length > 0) {
      await pool.query('DELETE FROM saved_posts WHERE user_id = $1 AND post_id = $2', [userId, postId]);
      return res.json({ saved: false, message: 'Itinerary se hata diya gaya' });
    } else {
      await pool.query('INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
      return res.json({ saved: true, message: 'Itinerary me save ho gaya' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch User's Saved Itinerary
router.get('/saved/:userId', async (req, res) => {
  try {
    const saved = await pool.query(`
      SELECT p.*, u.username FROM saved_posts sp
      JOIN posts p ON sp.post_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC
    `, [req.params.userId]);
    res.json(saved.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
