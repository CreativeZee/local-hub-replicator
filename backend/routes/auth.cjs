
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  headers: {
    'User-Agent': 'local-hub-replicator/1.0 (iamzee4@gmail.com)', // Replace with your real email
  },
};

const geocoder = NodeGeocoder(options);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, address } = req.body;

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
        }
      } catch (err) {
        console.warn('Geocoding failed, continuing without location:', err.message);
        // Don't block signup if geocoding fails
      }
    }

    user = new User({
      name,
      email,
      password,
      location,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, 'secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
console.log("User found:", user);
console.log("Comparing password with bcrypt hash...");
console.log("Login request received:", req.body);
console.log("User found:", user.email);
console.log("DB password hash:", user.password);
console.log("Entered password:", password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      'secret',
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

module.exports = router;
