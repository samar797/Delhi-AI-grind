const jwt = require('jsonwebtoken');

// Store active connections
const activeConnections = new Map();

module.exports = (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Authenticate socket connection
  const authenticate = async () => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        socket.emit('error', { message: 'Authentication required' });
        socket.disconnect();
        return null;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      socket.emit('error', { message: 'Invalid token' });
      socket.disconnect();
      return null;
    }
  };

  // Handle user subscription to panels
  socket.on('subscribe:panel', (panelId) => {
    socket.join(`panel:${panelId}`);
    console.log(`User ${socket.id} subscribed to panel ${panelId}`);
  });

  socket.on('unsubscribe:panel', (panelId) => {
    socket.leave(`panel:${panelId}`);
    console.log(`User ${socket.id} unsubscribed from panel ${panelId}`);
  });

  // Handle dashboard subscription
  socket.on('subscribe:dashboard', () => {
    socket.join('dashboard');
    console.log(`User ${socket.id} subscribed to dashboard updates`);
  });

  socket.on('unsubscribe:dashboard', () => {
    socket.leave('dashboard');
  });

  // Handle alerts subscription
  socket.on('subscribe:alerts', (userId) => {
    socket.join(`alerts:${userId}`);
    console.log(`User ${socket.id} subscribed to alerts`);
  });

  // Handle recycling updates subscription
  socket.on('subscribe:recycling', (userId) => {
    socket.join(`recycling:${userId}`);
    console.log(`User ${socket.id} subscribed to recycling updates`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    activeConnections.delete(socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Send welcome message
  socket.emit('connected', {
    message: 'Connected to Solar Intelligence',
    socketId: socket.id,
    timestamp: new Date().toISOString(),
  });
};
