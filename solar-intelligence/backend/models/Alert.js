const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  panelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolarPanel',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Dust Detected', 'Overheating', 'Performance Issue', 'Energy Loss', 'Hardware Fault', 'Weather Alert', 'Maintenance Due'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
  },
  acknowledgedBy: {
    type: String,
  },
  recommendedAction: {
    type: String,
  },
  metadata: {
    temperature: Number,
    efficiency: Number,
    powerOutput: Number,
    expectedOutput: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

alertSchema.index({ userId: 1, isRead: 1 });
alertSchema.index({ panelId: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
