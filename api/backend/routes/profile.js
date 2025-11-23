
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/bookmark/:postId
// @desc    Bookmark a post
// @access  Private
router.put('/bookmark/:postId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been bookmarked
    if (user.bookmarks.filter(bookmark => bookmark.post.toString() === req.params.postId).length > 0) {
      // Remove the bookmark
      const removeIndex = user.bookmarks.map(bookmark => bookmark.post.toString()).indexOf(req.params.postId);
      user.bookmarks.splice(removeIndex, 1);
      await user.save();
      return res.json({ msg: 'Post unbookmarked' });
    }

    user.bookmarks.unshift({ post: req.params.postId });

    await user.save();

    res.json({ msg: 'Post bookmarked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/bookmarks
// @desc    Get all bookmarked posts
// @access  Private
router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks.post');
    res.json(user.bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/interests', auth, async (req, res) => {
  const { interest } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.interests.includes(interest)) {
      // Remove interest
      user.interests = user.interests.filter((item) => item !== interest);
      await user.save();
      return res.json({ msg: 'Interest removed' });
    } else {
      // Add interest
      user.interests.unshift(interest);
      await user.save();
      return res.json({ msg: 'Interest added' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

 const upload = require('../middleware/upload');

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', [auth, upload.single('avatar')], async (req, res) => {
  const { name, address, bio } = req.body;

  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (address) profileFields.location = { address };
  if (bio) profileFields.bio = bio;
  if (req.file) profileFields.avatar = req.file.path;

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      // Update
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/location
// @desc    Get current user's location (for debugging)
// @access  Private
router.get('/location', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('location');
    res.json(user.location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
