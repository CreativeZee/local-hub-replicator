const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point', // ✅ important default
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
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

// ✅ This explicitly creates the geospatial index
MarketplaceItemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);
