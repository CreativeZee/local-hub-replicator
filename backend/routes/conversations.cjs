
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Conversation = require('../models/Conversation.cjs');
const Message = require('../models/Message.cjs');

// @route   GET api/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate('participants', ['name', 'avatar'])
      .populate('lastMessage');
    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/conversations/:id/messages
// @desc    Get all messages for a conversation
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    }).populate('from', ['name', 'avatar']);
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
