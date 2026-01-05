const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['Individual', 'Business'],
    default: 'Individual',
  },
  businessName: {
    type: String,
  },
  primaryServiceCategory: {
    type: String,
  },
  secondaryServiceCategories: [
    {
      type: String,
    },
  ],
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  avatar: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  coverImage: {
    type: String,
  },
  gallery: [
    {
      type: String,
    },
  ],
  diplomasAndCertificates: [ // New field for diplomas and certificates
    {
      type: String,
    },
  ],
  availability: {
    type: String,
  },
  bio: {
    type: String,
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public',
  },
  postVisibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public',
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  favorites: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'favorites.type',
      },
      type: {
        type: String,
        required: true,
        enum: ['Post', 'User', 'Recommendation', 'Service'],
      },
    },
  ],
  groups: [
    {
      group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    },
  ],
  interests: [
    {
      type: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  notificationSettings: {
    pushNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    postNotifications: { type: Boolean, default: true },
    groupNotifications: { type: Boolean, default: true },
    serviceNotifications: { type: Boolean, default: true },
    inviteNotifications: { type: Boolean, default: true },
  },
  feedPreferences: {
    contentType: {
      type: String,
      enum: ['all', 'services', 'posts', 'questions'],
      default: 'all',
    },
    sortBy: {
      type: String,
      enum: ['latest', 'trending', 'nearby'],
      default: 'latest',
    },
    filterByCategory: [
      {
        type: String,
      },
    ],
  },
});

UserSchema.index({ location: '2dsphere' }); // Explicit geospatial index on the location field

module.exports = mongoose.model('User', UserSchema);