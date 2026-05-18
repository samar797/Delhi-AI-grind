const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  panelId: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  installDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  specifications: {
    maxPower: { type: Number, required: true }, // in Watts
    voltage: { type: Number, required: true },
    current: { type: Number, required: true },
    efficiency: { type: Number, default: 20 }, // percentage
    area: { type: Number }, // in sq meters
    temperatureCoefficient: { type: Number },
  },
  currentMetrics: {
    temperature: { type: Number, default: 25 },
    voltage: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    power: { type: Number, default: 0 },
    efficiency: { type: Number, default: 0 },
    sunlightIntensity: { type: Number, default: 0 },
    panelAngle: { type: Number, default: 45 },
    healthScore: { type: Number, default: 100 },
    lastUpdated: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'faulty'],
    default: 'active',
  },
  maintenanceHistory: [{
    date: Date,
    type: {
      type: String,
      enum: ['cleaning', 'repair', 'inspection', 'replacement'],
    },
    description: String,
    cost: Number,
    technician: String,
  }],
  alerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
  }],
  totalEnergyGenerated: {
    type: Number,
    default: 0,
  },
  carbonOffset: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
solarPanelSchema.index({ 'location.coordinates': '2dsphere' });
solarPanelSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
