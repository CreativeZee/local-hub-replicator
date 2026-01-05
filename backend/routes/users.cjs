
const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');

// @route   GET api/users/search
// @desc    Search for users
// @access  Public
router.get('/search', async (req, res) => {
  const { q, lat, lon } = req.query;
  const searchCriteria = {};

  // Build the $or condition for name and businessName search
  const nameOrBusinessNameSearch = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { businessName: { $regex: q, $options: 'i' } },
    ],
  };

  if (q) {
    Object.assign(searchCriteria, nameOrBusinessNameSearch);
  }

  // Filter for Business users if location is provided, otherwise search all users matching 'q'
  if (lat && lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ msg: 'Invalid latitude or longitude.' });
    }

    searchCriteria.userType = 'Business'; // Only search business users when location is provided
    searchCriteria.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 10000, // 10 kilometers
      },
    };
  }

  try {
    const users = await User.find(searchCriteria).select('_id name avatar userType businessName');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
