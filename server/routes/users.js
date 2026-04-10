const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/profile', async (req, res) => {
  res.json(req.user);
});

router.put('/profile', async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'monthlyLimit', 'dailySafeSpend'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        req.user[key] = updates[key];
      }
    });
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('name email avatar').limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
