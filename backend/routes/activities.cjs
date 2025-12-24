const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Activity = require('../models/Activity.cjs');
const User = require('../models/User.cjs');

const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
  headers: {
    'User-Agent': 'local-hub-replicator/1.0 (mindcreative543@gmail.com)',
  },
};
const geocoder = NodeGeocoder(options);

// @route   POST api/activities
// @desc    Create a new activity
// @access  Private (Business User)
router.post('/', auth, async (req, res) => {
  const { clientId, description, serviceType, address, dateCompleted, clientFeedback } = req.body;

  try {
    const businessUser = await User.findById(req.user.id);
    if (!businessUser || businessUser.userType !== 'Business') {
      return res.status(401).json({ msg: 'Not authorized as a business user' });
    }

    const activityFields = {
      business: req.user.id,
      description,
      serviceType,
    };
    if (clientId) activityFields.client = clientId;
    if (dateCompleted) activityFields.dateCompleted = dateCompleted;
    if (clientFeedback) activityFields.clientFeedback = clientFeedback;

    if (address) {
      try {
        const geocodedData = await geocoder.geocode(address);
        if (
          geocodedData &&
          geocodedData.length > 0 &&
          geocodedData[0].longitude &&
          geocodedData[0].latitude
        ) {
          activityFields['location'] = {
            type: 'Point',
            coordinates: [geocodedData[0].longitude, geocodedData[0].latitude],
            address: geocodedData[0].formattedAddress,
          };
        } else {
          console.warn('Geocoding did not return valid coordinates for activity.');
        }
      } catch (err) {
        console.warn('Geocoding failed for activity, continuing without location:', err.message);
      }
    }

    const newActivity = new Activity(activityFields);
    const activity = await newActivity.save();
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/activities/business/:businessId
// @desc    Get all activities for a specific business
// @access  Public
router.get('/business/:businessId', async (req, res) => {
  try {
    const activities = await Activity.find({ business: req.params.businessId })
      .populate('client', ['name', 'avatar'])
      .sort({ dateCompleted: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/activities/client/:clientId
// @desc    Get all activities for a specific client
// @access  Private (only client can view their own activities)
router.get('/client/:clientId', auth, async (req, res) => {
  if (req.user.id !== req.params.clientId) {
    return res.status(401).json({ msg: 'User not authorized' });
  }
  try {
    const activities = await Activity.find({ client: req.params.clientId })
      .populate('business', ['businessName', 'avatar'])
      .sort({ dateCompleted: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/activities/:activityId
// @desc    Update an activity
// @access  Private (Business User who created the activity)
router.put('/:activityId', auth, async (req, res) => {
  const { clientId, description, serviceType, address, dateCompleted, clientFeedback } = req.body;

  try {
    let activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    if (activity.business.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this activity' });
    }

    if (clientId) activity.client = clientId;
    if (description) activity.description = description;
    if (serviceType) activity.serviceType = serviceType;
    if (dateCompleted) activity.dateCompleted = dateCompleted;
    if (clientFeedback) activity.clientFeedback = clientFeedback;

    if (address) {
        try {
            const geocodedData = await geocoder.geocode(address);
            if (geocodedData && geocodedData.length > 0 && geocodedData[0].longitude && geocodedData[0].latitude) {
                activity.location = {
                    type: 'Point',
                    coordinates: [geocodedData[0].longitude, geocodedData[0].latitude],
                    address: geocodedData[0].formattedAddress,
                };
            } else {
                console.warn('Geocoding did not return valid coordinates for activity update.');
            }
        } catch (err) {
            console.warn('Geocoding failed for activity update, continuing without location:', err.message);
        }
    }

    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/activities/:activityId
// @desc    Delete an activity
// @access  Private (Business User who created the activity)
router.delete('/:activityId', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    if (activity.business.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this activity' });
    }

    await activity.remove();
    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
