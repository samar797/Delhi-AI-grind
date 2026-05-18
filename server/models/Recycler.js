const mongoose = require('mongoose');

const recyclerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  businessLicense: {
    type: String,
    required: true,
  },
  certification: [{
    name: String,
    number: String,
    issuedBy: String,
    validUntil: Date,
    document: String,
  }],
  specialization: [{
    type: String,
    enum: ['solar_panels', 'batteries', 'inverters', 'electronics', 'metals', 'all'],
  }],
  serviceAreas: [{
    city: String,
    state: String,
    country: String,
    radius: Number, // in km
  }],
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    emergencyContact: String,
  },
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean },
  },
  capacity: {
    maxWeightPerMonth: Number, // in tons
    currentLoad: { type: Number, default: 0 },
    availableCapacity: Number,
  },
  pricing: {
    baseRate: Number, // per kg
    pickupFee: Number,
    processingFee: Number,
    currency: { type: String, default: 'USD' },
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now },
    response: String,
  }],
  stats: {
    totalRequests: { type: Number, default: 0 },
    completedRequests: { type: Number, default: 0 },
    cancelledRequests: { type: Number, default: 0 },
    totalRecycled: { type: Number, default: 0 }, // in kg
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, {
  timestamps: true,
});

recyclerSchema.index({ 'location.coordinates': '2dsphere' });
recyclerSchema.index({ specialization: 1, isActive: 1 });

module.exports = mongoose.model('Recycler', recyclerSchema);
