const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const User = require('../models/User.cjs');
const Post = require('../models/Post.cjs'); // Assuming Post model exists
const Service = require('../models/Service.cjs'); // Assuming Service model exists
const fs = require('fs').promises; // For file system operations

const upload = require('../middleware/upload.cjs');

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  httpAdapter: 'https', // Explicitly set to https
  formatter: null,
  headers: {
    'User-Agent': 'local-hub-replicator/1.0 (mindcreative543@gmail.com)', // IMPORTANT: Replace with your real email address
  },
};

const geocoder = NodeGeocoder(options);

// @route   POST api/profile/favorites
// @desc    Add item to favorites
// @access  Private
router.post('/favorites', auth, async (req, res) => {
  const { itemId, itemType } = req.body; // itemType could be 'Post', 'User', 'Service'

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if item is already favorited
    if (user.favorites.some(fav => fav.item.toString() === itemId && fav.type === itemType)) {
      return res.status(400).json({ msg: 'Item already in favorites' });
    }

    let itemExists = false;
    switch (itemType) {
      case 'Post':
        itemExists = await Post.findById(itemId);
        break;
      case 'User': // For favoriting other users/providers
        itemExists = await User.findById(itemId);
        break;
      case 'Service':
        itemExists = await Service.findById(itemId);
        break;
      // Add other cases for Recommendation, etc. if they become distinct models
      default:
        return res.status(400).json({ msg: 'Invalid item type' });
    }

    if (!itemExists) {
      return res.status(404).json({ msg: `${itemType} not found` });
    }

    user.favorites.unshift({ item: itemId, type: itemType });
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/favorites/:itemId
// @desc    Remove item from favorites
// @access  Private
router.delete('/favorites/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(
      (fav) => fav.item.toString() !== req.params.itemId
    );

    if (user.favorites.length === initialLength) {
      return res.status(404).json({ msg: 'Item not found in favorites' });
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'favorites.item',
        select: 'name avatar title description businessName', // Select fields relevant to different types
        populate: {
          path: 'user', // For posts, populate the user who made the post
          select: 'name avatar',
        },
      })
      .populate('groups.group'); // Populate group details

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get any user's profile by ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate({
        path: 'favorites.item',
        select: 'name avatar title description businessName',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      })
      .populate('groups.group');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    auth,
    upload.fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    const {
      name,
      address,
      bio,
      businessName,
      primaryServiceCategory,
      secondaryServiceCategories,
      phone,
      website,
      availability,
    } = req.body;

    const profileFields = {};
    if (name) profileFields.name = name;
    if (bio) profileFields.bio = bio;
    if (businessName) profileFields.businessName = businessName;
    if (primaryServiceCategory)
      profileFields.primaryServiceCategory = primaryServiceCategory;
    if (secondaryServiceCategories)
      profileFields.secondaryServiceCategories = secondaryServiceCategories;
    if (phone) profileFields.phone = phone;
    if (website) profileFields.website = website;
    if (availability) profileFields.availability = availability;

    if (req.files) {
      if (req.files.avatar && req.files.avatar.length > 0) {
        profileFields.avatar = req.files.avatar[0].path;
      }
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        profileFields.coverImage = req.files.coverImage[0].path;
      }
    }

    try {
      if (address) {
        try {
          const geocodedData = await geocoder.geocode(address);
          if (
            geocodedData &&
            geocodedData.length > 0 &&
            geocodedData[0].longitude &&
            geocodedData[0].latitude
          ) {
            profileFields['location.type'] = 'Point';
            profileFields['location.coordinates'] = [
              geocodedData[0].longitude,
              geocodedData[0].latitude,
            ];
            profileFields['location.address'] = geocodedData[0].formattedAddress;
          } else {
            console.warn('Geocoding did not return valid coordinates for profile update.');
          }
        } catch (err) {
          console.warn('Geocoding failed for profile update, continuing without location:', err.message);
        }
      }

      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/profile/gallery
// @desc    Add images to gallery
// @access  Private
router.post('/gallery', [auth, upload.array('gallery', 10)], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      user.gallery.push(...newImages);
    }

    await user.save();
    res.json(user.gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/gallery
// @desc    Delete image from gallery
// @access  Private
router.delete('/gallery', auth, async (req, res) => {
  const { imagePath } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const initialLength = user.gallery.length;
    user.gallery = user.gallery.filter((image) => image !== imagePath);

    if (user.gallery.length === initialLength) {
      return res.status(404).json({ msg: 'Image not found in gallery' });
    }

    await user.save();
    // Optionally delete the physical file
    // await fs.unlink(imagePath);
    res.json(user.gallery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/certificates
// @desc    Upload diplomas and certificates
// @access  Private (Business User)
router.post('/certificates', [auth, upload.array('certificates', 10)], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.userType !== 'Business') {
      return res.status(401).json({ msg: 'Only business users can upload certificates' });
    }

    if (req.files && req.files.length > 0) {
      const newCertificates = req.files.map((file) => file.path);
      user.diplomasAndCertificates.push(...newCertificates);
    }

    await user.save();
    res.json(user.diplomasAndCertificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/certificates
// @desc    Get diplomas and certificates
// @access  Private (Business User can view their own, Public for others)
router.get('/certificates/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('diplomasAndCertificates');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.diplomasAndCertificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile/certificates
// @desc    Delete a diploma or certificate
// @access  Private (Business User)
router.delete('/certificates', auth, async (req, res) => {
  const { filePath } = req.body; // Expecting the full file path to delete
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.userType !== 'Business') {
      return res.status(401).json({ msg: 'Only business users can delete certificates' });
    }

    const initialLength = user.diplomasAndCertificates.length;
    user.diplomasAndCertificates = user.diplomasAndCertificates.filter((cert) => cert !== filePath);

    if (user.diplomasAndCertificates.length === initialLength) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    await user.save();
    // Optionally delete the physical file
    // await fs.unlink(filePath); // Need to handle path correctly, 'filePath' is relative

    res.json(user.diplomasAndCertificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/email
// @desc    Update user's email address
// @access  Private
router.put('/email', auth, async (req, res) => {
  const { newEmail } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if new email is already taken by another user
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'Email is already in use by another account' });
    }

    user.email = newEmail;
    await user.save();
    res.json({ msg: 'Email updated successfully', email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/phone
// @desc    Update user's phone number
// @access  Private
router.put('/phone', auth, async (req, res) => {
  const { newPhone } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.phone = newPhone;
    await user.save();
    res.json({ msg: 'Phone number updated successfully', phone: user.phone });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/notifications
// @desc    Update user's notification settings
// @access  Private
router.put('/notifications', auth, async (req, res) => {
  const { notificationSettings } = req.body; // Expecting an object like { pushNotifications: true, emailNotifications: false }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update only the provided notification settings
    if (notificationSettings && typeof notificationSettings === 'object') {
      Object.keys(notificationSettings).forEach(key => {
        if (typeof user.notificationSettings[key] !== 'undefined') {
          user.notificationSettings[key] = notificationSettings[key];
        }
      });
    }

    await user.save();
    res.json({ msg: 'Notification settings updated successfully', notificationSettings: user.notificationSettings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/privacy
// @desc    Update user's privacy settings (profile and post visibility, block/unblock users)
// @access  Private
router.put('/privacy', auth, async (req, res) => {
  const { profileVisibility, postVisibility, blockedUserId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (profileVisibility) {
      user.profileVisibility = profileVisibility;
    }
    if (postVisibility) {
      user.postVisibility = postVisibility;
    }

    if (blockedUserId) {
      const targetUser = await User.findById(blockedUserId);
      if (!targetUser) {
        return res.status(404).json({ msg: 'Target user not found' });
      }

      const isBlocked = user.blockedUsers.includes(blockedUserId);
      if (isBlocked) {
        // Unblock user
        user.blockedUsers = user.blockedUsers.filter(
          (id) => id.toString() !== blockedUserId
        );
        res.json({ msg: 'User unblocked successfully', blockedUsers: user.blockedUsers });
      } else {
        // Block user
        user.blockedUsers.push(blockedUserId);
        res.json({ msg: 'User blocked successfully', blockedUsers: user.blockedUsers });
      }
    } else {
      await user.save();
      res.json({ msg: 'Privacy settings updated successfully', user });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/blocked-users
// @desc    Get the list of users blocked by the authenticated user
// @access  Private
router.get('/blocked-users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('blockedUsers', ['name', 'avatar']);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.blockedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/blocked-users
// @desc    Get the list of users blocked by the authenticated user
// @access  Private
router.get('/blocked-users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('blockedUsers', ['name', 'avatar']);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.blockedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/feed-preferences
// @desc    Update user's feed preferences
// @access  Private
router.put('/feed-preferences', auth, async (req, res) => {
  const { contentType, sortBy, filterByCategory } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (contentType) {
      user.feedPreferences.contentType = contentType;
    }
    if (sortBy) {
      user.feedPreferences.sortBy = sortBy;
    }
    if (filterByCategory && Array.isArray(filterByCategory)) {
      user.feedPreferences.filterByCategory = filterByCategory;
    }

    await user.save();
    res.json({ msg: 'Feed preferences updated successfully', feedPreferences: user.feedPreferences });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;



