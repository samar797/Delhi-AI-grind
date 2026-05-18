const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'recycler', 'manufacturer', 'admin'],
    default: 'user',
  },
  profileImage: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  solarPanels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SolarPanel',
  }],
  recyclingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecyclingRequest',
  }],
  rewards: {
    points: { type: Number, default: 0 },
    tier: { 
      type: String, 
      enum: ['bronze', 'silver', 'gold', 'platinum'], 
      default: 'bronze' 
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
