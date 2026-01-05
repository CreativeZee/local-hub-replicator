const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const auth = require('../middleware/auth.cjs'); // Import auth middleware
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https', // Explicitly set to https
  formatter: null,
  headers: {
    'User-Agent': 'local-hub-replicator/1.0 (mindcreative543@gmail.com)', // IMPORTANT: Replace with your real email address
  },
};

const geocoder = NodeGeocoder(options);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, address, userType, businessName, businessType } = req.body;

  // Basic input validation to give clearer errors instead of 500
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let location = null;

    if (address && address.trim() !== '') {
      try {
        const geocodedData = await geocoder.geocode(address);
        if (
          geocodedData &&
          geocodedData.length > 0 &&
          geocodedData[0].longitude &&
          geocodedData[0].latitude
        ) {
          location = {
            type: 'Point',
            coordinates: [geocodedData[0].longitude, geocodedData[0].latitude],
            address: geocodedData[0].formattedAddress,
          };
        } else {
          console.warn('Geocoding did not return valid coordinates for registration.');
        }
      } catch (err) {
        console.warn('Geocoding failed for registration, continuing without location:', err.message);
      }
    }

    const newUser = {
      name,
      email,
      password,
      location,
      userType,
    };

    if (userType === 'Business') {
      newUser.businessName = businessName;
      newUser.businessType = businessType; // Assuming businessType is stored
    }

    user = new User(newUser);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSecret = process.env.JWT_SECRET || 'secret'; // Use environment variable
    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSecret = process.env.JWT_SECRET || 'secret'; // Use environment variable
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/change-password
// @desc    Change user's password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
