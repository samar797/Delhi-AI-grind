const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
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
  installationDate: {
    type: Date,
    default: Date.now,
  },
  capacity: {
    type: Number, // in kW
    required: true,
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance', 'Offline'],
    default: 'Active',
  },
  currentData: {
    temperature: { type: Number, default: 25 }, // Celsius
    voltage: { type: Number, default: 0 }, // Volts
    current: { type: Number, default: 0 }, // Amps
    power: { type: Number, default: 0 }, // Watts
    efficiency: { type: Number, default: 100 }, // Percentage
    angle: { type: Number, default: 30 }, // Degrees
    sunlightIntensity: { type: Number, default: 0 }, // W/m²
  },
  healthScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  totalEnergyGenerated: {
    type: Number,
    default: 0, // kWh
  },
  carbonOffset: {
    type: Number,
    default: 0, // kg CO2
  },
  maintenanceHistory: [{
    date: Date,
    type: String,
    description: String,
    cost: Number,
  }],
  alerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
  }],
  lastMaintenance: {
    type: Date,
  },
  nextMaintenanceDue: {
    type: Date,
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

solarPanelSchema.index({ userId: 1 });
solarPanelSchema.index({ status: 1 });
solarPanelSchema.index({ location: '2dsphere' });

solarPanelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
