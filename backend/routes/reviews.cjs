
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Review = require('../models/Review.cjs');
const User = require('../models/User.cjs');

// @route   POST api/reviews/:userId
// @desc    Create a review for a user
// @access  Private
router.post('/:userId', auth, async (req, res) => {
  const { text, rating } = req.body;
  const { userId } = req.params;

  try {
    const to = await User.findById(userId);
    if (!to) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const review = new Review({
      text,
      rating,
      from: req.user.id,
      to: userId,
    });

    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/reviews/:userId
// @desc    Get all reviews for a user
// @access  Public
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ to: userId }).populate('from', ['name', 'avatar']);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
