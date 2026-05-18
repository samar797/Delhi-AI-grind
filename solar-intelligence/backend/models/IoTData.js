const mongoose = require('mongoose');

const iotDataSchema = new mongoose.Schema({
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolarPanel',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  temperature: {
    type: Number,
    required: true,
  },
  voltage: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
    required: true,
  },
  efficiency: {
    type: Number,
    required: true,
  },
  angle: {
    type: Number,
    required: true,
  },
  sunlightIntensity: {
    type: Number,
    required: true,
  },
  weatherCondition: {
    type: String,
    enum: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy'],
    default: 'Sunny',
  },
  ambientTemperature: {
    type: Number,
  },
  humidity: {
    type: Number,
  },
  windSpeed: {
    type: Number,
  },
  energyGenerated: {
    type: Number,
    default: 0,
  },
  healthScore: {
    type: Number,
    default: 100,
  },
  anomalies: [{
    type: String,
  }],
});

iotDataSchema.index({ panelId: 1, timestamp: -1 });
iotDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('IoTData', iotDataSchema);
