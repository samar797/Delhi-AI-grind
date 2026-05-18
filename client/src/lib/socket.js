import { io } from 'socket.io-client';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token'),
        userId,
      },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Solar Panel Events
  subscribeToPanel(panelId, callback) {
    this.socket?.emit('subscribe:panel', panelId);
    this.socket?.on(`panel:${panelId}:update`, callback);
    return () => {
      this.socket?.off(`panel:${panelId}:update`, callback);
      this.socket?.emit('unsubscribe:panel', panelId);
    };
  }

  // Alert Events
  onAlert(callback) {
    this.socket?.on('alert:new', callback);
    return () => this.socket?.off('alert:new', callback);
  }

  // Recycling Events
  onRecyclingUpdate(callback) {
    this.socket?.on('recycling:update', callback);
    return () => this.socket?.off('recycling:update', callback);
  }

  // IoT Data Events
  onIoTData(callback) {
    this.socket?.on('iot:data', callback);
    return () => this.socket?.off('iot:data', callback);
  }

  // AI Analysis Events
  onAIAnalysis(callback) {
    this.socket?.on('ai:analysis', callback);
    return () => this.socket?.off('ai:analysis', callback);
  }

  // Dashboard Updates
  onDashboardUpdate(callback) {
    this.socket?.on('dashboard:update', callback);
    return () => this.socket?.off('dashboard:update', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
