const mongoose = require('mongoose');

const awarenessPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Education', 'News', 'Tips', 'Campaign', 'Success Story', 'Research'],
    default: 'Education',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  featuredImage: {
    type: String,
  },
  images: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  relatedPanels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolarPanel',
  }],
  impactMetrics: {
    carbonSaved: Number,
    energySaved: Number,
    treesEquivalent: Number,
  },
  callToAction: {
    text: String,
    link: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

awarenessPostSchema.index({ category: 1 });
awarenessPostSchema.index({ isPublished: 1 });
awarenessPostSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('AwarenessPost', awarenessPostSchema);
