
const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');

// @route   GET api/users/search
// @desc    Search for users
// @access  Public
router.get('/search', async (req, res) => {
  const { q } = req.query;

  try {
    const users = await User.find({
      name: { $regex: q, $options: 'i' },
      userType: 'Business',
    }).select('name');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
