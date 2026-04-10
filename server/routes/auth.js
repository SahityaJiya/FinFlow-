const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    
    console.log('Registration success:', user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    // Demo account - bypass password check
    if (email === 'demo@finflow.com') {
      let demoUser = await User.findOne({ email: 'demo@finflow.com' });
      if (!demoUser) {
        demoUser = new User({
          name: 'Demo User',
          email: 'demo@finflow.com',
          password: 'demo123',
          monthlyLimit: 50000,
          dailySafeSpend: 1500
        });
        await demoUser.save();
        console.log('Demo user created');
      }
      const token = jwt.sign({ userId: demoUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
      console.log('Demo login success');
      return res.json({ user: demoUser, token });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    console.log('Login success');
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

router.post('/google', async (req, res) => {
  try {
    // Google OAuth not configured - return error
    res.status(501).json({ error: 'Google OAuth not configured. Please use email login.' });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
