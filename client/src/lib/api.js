import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getEnergyData: (period = 'day') => api.get(`/api/dashboard/energy?period=${period}`),
  getCarbonReduction: () => api.get('/api/dashboard/carbon'),
};

// Solar Panel APIs
export const solarAPI = {
  getPanels: () => api.get('/api/solar/panels'),
  getPanelData: (id) => api.get(`/api/solar/panels/${id}`),
  getLiveMetrics: (id) => api.get(`/api/solar/panels/${id}/metrics`),
  updatePanel: (id, data) => api.put(`/api/solar/panels/${id}`, data),
};

// IoT Data APIs
export const iotAPI = {
  getHistoricalData: (panelId, period = '24h') => 
    api.get(`/api/iot/data?panelId=${panelId}&period=${period}`),
  getRealTimeData: (panelId) => api.get(`/api/iot/realtime/${panelId}`),
};

// AI Analysis APIs
export const aiAPI = {
  analyzeEfficiency: (panelId) => api.get(`/api/ai/analyze/${panelId}`),
  getPredictions: (panelId) => api.get(`/api/ai/predictions/${panelId}`),
  getMaintenanceRecommendations: (panelId) => 
    api.get(`/api/ai/maintenance/${panelId}`),
  getHealthScore: (panelId) => api.get(`/api/ai/health/${panelId}`),
};

// Alert APIs
export const alertAPI = {
  getAlerts: (status = 'all') => api.get(`/api/alerts?status=${status}`),
  markAsRead: (id) => api.put(`/api/alerts/${id}/read`),
  markAllAsRead: () => api.put('/api/alerts/read-all'),
  deleteAlert: (id) => api.delete(`/api/alerts/${id}`),
};

// Recycling APIs
export const recyclingAPI = {
  getRecyclers: (location) => api.get(`/api/recycling/recyclers?location=${location}`),
  createRequest: (data) => api.post('/api/recycling/request', data),
  getRequests: () => api.get('/api/recycling/requests'),
  updateRequestStatus: (id, status) => 
    api.put(`/api/recycling/requests/${id}/status`, { status }),
  trackRequest: (id) => api.get(`/api/recycling/requests/${id}/track`),
};

// Rewards APIs
export const rewardsAPI = {
  getBalance: () => api.get('/api/rewards/balance'),
  getTransactions: () => api.get('/api/rewards/transactions'),
  redeemCoupon: (code) => api.post('/api/rewards/redeem', { code }),
  scanQR: (qrData) => api.post('/api/rewards/scan', qrData),
  getCoupons: () => api.get('/api/rewards/coupons'),
};

// Awareness APIs
export const awarenessAPI = {
  getPosts: () => api.get('/api/awareness/posts'),
  getPost: (id) => api.get(`/api/awareness/posts/${id}`),
  createPost: (data) => api.post('/api/awareness/posts', data),
  getStats: () => api.get('/api/awareness/stats'),
};

// Analytics APIs
export const analyticsAPI = {
  getReport: (type, period) => 
    api.get(`/api/analytics/report?type=${type}&period=${period}`),
  getInsights: () => api.get('/api/analytics/insights'),
  downloadReport: (type, period) => 
    api.get(`/api/analytics/download?type=${type}&period=${period}`, {
      responseType: 'blob'
    }),
};

// Location APIs
export const locationAPI = {
  getMachineLocations: () => api.get('/api/locations/machines'),
  getNearbyRecyclers: (lat, lng, radius = 10) => 
    api.get(`/api/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  calculateRoute: (start, end) => 
    api.get(`/api/locations/route?start=${start}&end=${end}`),
};
