
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Group = require('../models/Group.cjs');
const User = require('../models/User.cjs');

// @route   POST api/groups
// @desc    Create a group
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log(user);
const coords = user?.location?.coordinates;
console.log(coords);
    const newGroup = new Group({
      name: req.body.name,
      user: req.user.id,
      description: req.body.description,
      image: req.body.image,
      user: req.user.id,
      location: {
  type: "Point",
  coordinates: user.location.coordinates,
  address: user.location.address,
},

      members: [{ user: req.user.id }],
    });

    const group = await newGroup.save();

    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups
// @desc    Get all groups
// @access  Public
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    let groups;
    if (lat && lon) {
      groups = await Group.find({
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
      groups = await Group.find().populate('user', ['name', 'avatar']).sort({ date: -1 });
    }
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups/user/:userId
// @desc    Get all groups a user is a member of
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ "members.user": req.params.userId }).populate('user', ['name', 'avatar']).sort({ date: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/groups/created/:userId
// @desc    Get all groups created by a user
// @access  Public
router.get('/created/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ user: req.params.userId }).populate('user', ['name', 'avatar']).sort({ date: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/groups/:groupId/join
// @desc    Join a group
// @access  Private
router.post('/:groupId/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.some(member => member.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'User already a member of this group' });
    }

    group.members.push({ user: req.user.id });

    await group.save();

    res.json(group.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
