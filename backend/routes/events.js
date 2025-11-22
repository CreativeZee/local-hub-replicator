
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newEvent = new Event({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      image: req.body.image,
      location: user.location,
    });

    const event = await newEvent.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    let events;
    if (lat && lon) {
      events = await Event.find({
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
      events = await Event.find().populate('user', ['name', 'avatar']).sort({ date: -1 });
    }
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/user/:userId
// @desc    Get all events by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const events = await Event.find({ user: req.params.userId }).populate('user', ['name', 'avatar']).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/attending/:userId
// @desc    Get all events a user is attending
// @access  Public
router.get('/attending/:userId', async (req, res) => {
  try {
    const events = await Event.find({ "attendees.user": req.params.userId }).populate('user', ['name', 'avatar']).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/interested/:id
// @desc    Express interest in an event
// @access  Private
router.put('/interested/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    // Check if the user has already expressed interest
    if (event.interested.filter(interest => interest.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Already interested' });
    }

    event.interested.unshift({ user: req.user.id });

    await event.save();

    res.json(event.interested);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
