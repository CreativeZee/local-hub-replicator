
const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth.cjs');

const MarketplaceItem = require('../models/MarketplaceItem.cjs');

const User = require('../models/User.cjs');



// @route   POST api/marketplace
// @desc    Create a marketplace item
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    let location = user.location;

    // ✅ If frontend sent coordinates, use them instead
    if (req.body.lat && req.body.lon) {
      location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)],
        address: user.location?.address || "User provided location",
      };
    }

    const newItem = new MarketplaceItem({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      location,
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




// @route   GET api/marketplace

// @desc    Get all marketplace items

// @access  Public

router.get('/', async (req, res) => {

  const { lat, lon } = req.query;



  try {

    let items;

    if (lat && lon) {

      items = await MarketplaceItem.find({

        location: {

          $near: {

            $geometry: {

              type: 'Point',

              coordinates: [parseFloat(lon), parseFloat(lat)],

            },

            $maxDistance: 10000, // 10km

          },

        },

      }).populate('user', ['name', 'avatar']).sort({ date: -1 });

    } else {

      items = await MarketplaceItem.find().populate('user', ['name', 'avatar']).sort({ date: -1 });

    }

    res.json(items);

  } catch (err) {

    console.error(err.message);

    res.status(500).send('Server Error');

  }

});



// @route   GET api/marketplace/user/:userId

// @desc    Get all marketplace items by user ID

// @access  Public

router.get('/user/:userId', async (req, res) => {

  try {

    const items = await MarketplaceItem.find({ user: req.params.userId }).populate('user', ['name', 'avatar']).sort({ date: -1 });

    res.json(items);

  } catch (err) {

    console.error(err.message);

    res.status(500).send('Server Error');

  }

});



module.exports = router;


