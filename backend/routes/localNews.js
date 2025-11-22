
const express = require('express');
const router = express.Router();
const LocalNews = require('../models/LocalNews');

// @route   GET api/local-news
// @desc    Get all local news
// @access  Public
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    let news;
    if (lat && lon) {
      news = await LocalNews.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lon), parseFloat(lat)],
            },
            $maxDistance: 10000, // 10km
          },
        },
      }).sort({ date: -1 });
    } else {
      news = await LocalNews.find().sort({ date: -1 });
    }
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
