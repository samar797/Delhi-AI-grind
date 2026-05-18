require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const solarRoutes = require('./routes/solar');
const iotRoutes = require('./routes/iot');
const aiRoutes = require('./routes/ai');
const alertRoutes = require('./routes/alerts');
const recyclingRoutes = require('./routes/recycling');
const rewardsRoutes = require('./routes/rewards');
const awarenessRoutes = require('./routes/awareness');
const analyticsRoutes = require('./routes/analytics');
const locationRoutes = require('./routes/locations');

// Import socket handler
const socketHandler = require('./sockets/socketHandler');

// Import simulation service
const { startSimulation } = require('./services/iotSimulation');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-intelligence';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Start IoT simulation after DB connection
    startSimulation(io);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    // For demo purposes, continue without DB
    console.log('⚠️  Running in demo mode without database');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/solar', solarRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/locations', locationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Socket.IO connection handler
io.on('connection', socketHandler);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Solar Intelligence Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

module.exports = { app, io };
