const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET api/news
// @desc    Get local news
// @access  Public
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ msg: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=local&apiKey=c2a69125733347b7b13317b7a5e5e4b8&lat=${lat}&lon=${lon}`
    );
    res.json(response.data.articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
