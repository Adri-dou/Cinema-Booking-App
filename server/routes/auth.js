const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const router = express.Router();

// JWT Secret
const JWT_SECRET = 'your_secret_key';

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Create a new user
    const newUser = new User({
      email: email,
      password: password,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    //console.log('Stored Password:', user.password);
 
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    //console.log('Is Match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking route
router.post('/book-session', authenticateToken, async (req, res) => {
  try {
    const { id, movieTitle, selectedSeats, dateTimeSession, posterPath } = req.body;

    // Validate request body
    if (!id || !movieTitle || !selectedSeats || !dateTimeSession || !posterPath) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the order to bookedSessions
    user.bookedSessions.push({ id, movieTitle, selectedSeats, dateTimeSession, posterPath });
    await user.save();

    res.status(200).json({ message: "Session booked successfully" });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
