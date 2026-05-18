const mongoose = require('mongoose');

const recyclingRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recycler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recycler',
  },
  requestType: {
    type: String,
    enum: ['panel_disposal', 'battery_recycling', 'inverter_recycling', 'mixed_waste'],
    required: true,
  },
  items: [{
    type: {
      type: String,
      enum: ['solar_panel', 'battery', 'inverter', 'cables', 'mounting_structure', 'other'],
      required: true,
    },
    quantity: { type: Number, required: true },
    weight: { type: Number }, // in kg
    condition: {
      type: String,
      enum: ['working', 'damaged', 'end_of_life', 'unknown'],
    },
    description: String,
    images: [String],
  }],
  pickupAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'sms'],
      default: 'phone',
    },
  },
  preferredPickupDate: {
    type: Date,
    required: true,
  },
  pickupTimeSlot: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'flexible'],
  },
  status: {
    type: String,
    enum: [
      'requested',
      'pending_approval',
      'recycler_assigned',
      'pickup_scheduled',
      'in_transit',
      'recycling_started',
      'recycled_successfully',
      'cancelled',
      'rejected',
    ],
    default: 'requested',
  },
  estimatedValue: {
    type: Number,
  },
  finalValue: {
    type: Number,
  },
  rewardsPoints: {
    type: Number,
    default: 0,
  },
  trackingHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'updatedByModel',
    },
    updatedByModel: {
      type: String,
      enum: ['User', 'Recycler', 'Admin'],
    },
  }],
  documents: [{
    type: String,
    url: String,
    name: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  notes: {
    type: String,
  },
  cancellationReason: String,
}, {
  timestamps: true,
});

recyclingRequestSchema.index({ user: 1, createdAt: -1 });
recyclingRequestSchema.index({ recycler: 1, status: 1 });
recyclingRequestSchema.index({ 'pickupAddress.coordinates': '2dsphere' });

module.exports = mongoose.model('RecyclingRequest', recyclingRequestSchema);
