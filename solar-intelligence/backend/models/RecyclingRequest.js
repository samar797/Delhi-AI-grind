const mongoose = require('mongoose');

const recyclingRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recyclerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recycler',
    required: true,
  },
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolarPanel',
  },
  requestType: {
    type: String,
    enum: ['Pickup', 'Drop-off', 'Assessment'],
    default: 'Pickup',
  },
  status: {
    type: String,
    enum: ['Requested', 'Confirmed', 'Pickup Scheduled', 'In Transit', 'Recycling Started', 'Recycled Successfully', 'Cancelled'],
    default: 'Requested',
  },
  materials: [{
    type: {
      name: String,
      quantity: Number,
      unit: String, // kg, pieces, etc.
      condition: String,
    },
  }],
  totalWeight: {
    type: Number,
    default: 0, // kg
  },
  pickupLocation: {
    address: String,
    latitude: Number,
    longitude: Number,
    instructions: String,
  },
  preferredDate: {
    type: Date,
  },
  scheduledDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  estimatedValue: {
    type: Number,
    default: 0,
  },
  finalValue: {
    type: Number,
  },
  notes: {
    type: String,
  },
  images: [{
    type: String,
  }],
  documents: [{
    type: String,
  }],
  trackingHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  rewardPoints: {
    type: Number,
    default: 0,
  },
  carbonOffset: {
    type: Number,
    default: 0, // kg CO2
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

recyclingRequestSchema.index({ userId: 1 });
recyclingRequestSchema.index({ recyclerId: 1 });
recyclingRequestSchema.index({ status: 1 });

recyclingRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RecyclingRequest', recyclingRequestSchema);
