
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Post = require('../models/Post.cjs');
const User = require('../models/User.cjs');
const upload = require('../middleware/upload.cjs'); // Import upload middleware

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
  console.log("Received request to create post:", req.body);
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.file ? req.file.path : '', // Use req.file.path for uploaded image
      user: req.user.id,
      location: user.location,
      group: req.body.groupId, // Include groupId from request body
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    let posts;
    if (lat && lon) {
      posts = await Post.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lon), parseFloat(lat)],
            },
            $maxDistance: 10000, // 10km
          },
        },
      }).populate('user', ['name', 'avatar', 'userType', 'businessName']).sort({ date: -1 });
    } else {
      posts = await Post.find().populate('user', ['name', 'avatar', 'userType', 'businessName']).sort({ date: -1 });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/user/:userId
// @desc    Get all posts by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate('user', ['name', 'avatar', 'userType', 'businessName']).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/location/:postId
// @desc    Get a post's location (for debugging)
// @access  Public
router.get('/location/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).select('location');
    res.json(post.location);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    if (!post) { // Add this check
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();

    // Re-populate comments to send back user details if needed for frontend
    const populatedPost = await Post.findById(req.params.id).populate('comments.user', ['_id', 'name', 'avatar']);
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/comment/:id/:comment_id
// @desc    Edit a comment on a post
// @access  Private
router.put('/comment/:id/:comment_id', auth, async (req, res) => {
  const { newText } = req.body;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Find the comment by ID
    let comment = post.comments.find(
      (comm) => comm.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user: only comment owner or post owner can edit
    if (
      comment.user.toString() !== req.user.id &&
      post.user.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized to edit this comment' });
    }

    comment.text = newText; // Update comment text

    await post.save();

    // Re-populate comments to send back user details for frontend
    const populatedPost = await Post.findById(req.params.id).populate('comments.user', ['_id', 'name', 'avatar']);
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post or comment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/reindex
// @desc    Recreate the geospatial index
// @access  Public
router.get('/reindex', async (req, res) => {
  try {
    await Post.collection.dropIndex('location_2dsphere');
    await Post.collection.createIndex({ location: '2dsphere' });
    res.send('Geospatial index for posts recreated');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
