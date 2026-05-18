import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getEnergyData: (period = 'day') => api.get(`/dashboard/energy?period=${period}`),
  getEfficiency: () => api.get('/dashboard/efficiency'),
};

export const solarAPI = {
  getPanels: () => api.get('/solar/panels'),
  getPanelData: (panelId) => api.get(`/solar/panels/${panelId}/data`),
  getLiveMetrics: () => api.get('/solar/live'),
  updatePanel: (panelId, data) => api.put(`/solar/panels/${panelId}`, data),
};

export const alertAPI = {
  getAlerts: () => api.get('/alerts'),
  markAsRead: (alertId) => api.put(`/alerts/${alertId}/read`),
  markAllAsRead: () => api.put('/alerts/read-all'),
  deleteAlert: (alertId) => api.delete(`/alerts/${alertId}`),
};

export const recyclingAPI = {
  getRecyclers: () => api.get('/recycling/recyclers'),
  getNearbyRecyclers: (lat, lng, radius = 10) => 
    api.get(`/recycling/recyclers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  createRequest: (data) => api.post('/recycling/requests', data),
  getRequests: () => api.get('/recycling/requests'),
  updateRequestStatus: (requestId, status) => 
    api.put(`/recycling/requests/${requestId}/status`, { status }),
  getRecyclerById: (id) => api.get(`/recycling/recyclers/${id}`),
};

export const analyticsAPI = {
  getReports: (type = 'daily') => api.get(`/analytics/reports?type=${type}`),
  getSustainability: () => api.get('/analytics/sustainability'),
  getCarbonReduction: () => api.get('/analytics/carbon'),
  downloadReport: (type) => api.get(`/analytics/reports/${type}/download`, {
    responseType: 'blob',
  }),
};

export const awarenessAPI = {
  getPosts: () => api.get('/awareness/posts'),
  createPost: (data) => api.post('/awareness/posts', data),
  getStats: () => api.get('/awareness/stats'),
};

export const rewardsAPI = {
  getBalance: () => api.get('/rewards/balance'),
  getTransactions: () => api.get('/rewards/transactions'),
  redeemCoupon: (couponCode) => api.post('/rewards/redeem', { couponCode }),
  scanQR: (qrData) => api.post('/rewards/scan', qrData),
};

export default api;
