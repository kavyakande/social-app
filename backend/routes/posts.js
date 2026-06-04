const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Post     = require('../models/Post');
const auth     = require('../middleware/authMiddleware');
const router   = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image    = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !image)
      return res.status(400).json({ message: 'Post needs text or image' });

    const post = await Post.create({
      username: req.user.username,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like / unlike
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post     = await Post.findById(req.params.id);
    const username = req.user.username;
    const liked    = post.likes.includes(username);

    if (liked) {
      post.likes = post.likes.filter(u => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ username: req.user.username, text: req.body.text });
    await post.save();
    res.json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;