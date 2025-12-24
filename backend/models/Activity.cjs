const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The business user who performed the activity
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The client for whom the activity was performed (optional)
  },
  description: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
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
  dateCompleted: {
    type: Date,
    default: Date.now,
  },
  clientFeedback: {
    type: String, // Optional feedback from the client
  },
});

ActivitySchema.index({ 'location.coordinates': '2dsphere' });
module.exports = mongoose.model('Activity', ActivitySchema);
