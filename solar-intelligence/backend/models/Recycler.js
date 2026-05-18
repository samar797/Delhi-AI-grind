const mongoose = require('mongoose');

const recyclerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  certification: {
    type: String,
    enum: ['ISO 14001', 'R2 Certified', 'e-Stewards', 'Local Certified', 'Other'],
  },
  description: {
    type: String,
  },
  services: [{
    type: String,
  }],
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'USA',
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String,
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  totalRecycled: {
    type: Number,
    default: 0, // in kg
  },
  acceptedMaterials: [{
    type: String,
  }],
  pickupAvailable: {
    type: Boolean,
    default: true,
  },
  pickupRadius: {
    type: Number,
    default: 50, // km
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  images: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

recyclerSchema.index({ geoLocation: '2dsphere' });
recyclerSchema.index({ isActive: 1 });
recyclerSchema.index({ rating: -1 });

recyclerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.location.coordinates) {
    this.geoLocation.coordinates = this.location.coordinates;
  }
  next();
});

module.exports = mongoose.model('Recycler', recyclerSchema);
