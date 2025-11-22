
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 👈 add this
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    address: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Group', GroupSchema);
