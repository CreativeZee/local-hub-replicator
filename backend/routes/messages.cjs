
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.cjs');
const Message = require('../models/Message.cjs');
const Conversation = require('../models/Conversation.cjs');

// @route   POST api/messages
// @desc    Create a new message
// @access  Private
router.post('/', auth, async (req, res) => {
  const { to, text } = req.body;

  try {
    let conversation = await Conversation.findOneAndUpdate(
      {
        participants: { $all: [req.user.id, to] },
      },
      {
        $set: {
          participants: [req.user.id, to],
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    const message = new Message({
      conversation: conversation._id,
      from: req.user.id,
      to,
      text,
    });

    await message.save();

    conversation.lastMessage = message._id;
    await conversation.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
