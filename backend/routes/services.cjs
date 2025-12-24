const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Service = require('../models/Service.cjs');
const User = require('../models/User.cjs');

// @route   POST api/services
// @desc    Create a service
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, description, category, price } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.userType !== 'Business') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const newService = new Service({
      user: req.user.id,
      name,
      description,
      category,
      price,
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/services/user/:userId
// @desc    Get all services for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const services = await Service.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/services/:serviceId
// @desc    Update a service
// @access  Private
router.put('/:serviceId', auth, async (req, res) => {
  const { name, description, category, price } = req.body;

  try {
    let service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedService = {
      name: name || service.name,
      description: description || service.description,
      category: category || service.category,
      price: price || service.price,
    };

    service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      { $set: updatedService },
      { new: true }
    );

    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/services/:serviceId
// @desc    Delete a service
// @access  Private
router.delete('/:serviceId', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    if (service.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await service.remove();

    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
