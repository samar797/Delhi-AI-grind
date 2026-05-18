import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateEfficiency = (actual, expected) => {
  if (!expected || expected === 0) return 0;
  return Math.min((actual / expected) * 100, 100);
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'high':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'low':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'text-green-500 bg-green-500/10 border-green-500/30';
    case 'pending':
    case 'processing':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'inactive':
    case 'failed':
      return 'text-red-500 bg-red-500/10 border-red-500/30';
    default:
      return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
  }
};

export const generatePanelId = () => {
  return `SP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const simulateIoTData = (baseValues) => {
  const variation = () => (Math.random() - 0.5) * 0.2;
  
  return {
    temperature: Math.max(20, Math.min(80, baseValues.temperature + variation() * 10)),
    voltage: Math.max(0, baseValues.voltage + variation() * 5),
    current: Math.max(0, baseValues.current + variation() * 2),
    efficiency: Math.max(0, Math.min(100, baseValues.efficiency + variation() * 5)),
    sunlightIntensity: Math.max(0, Math.min(1000, baseValues.sunlightIntensity + variation() * 100)),
    panelAngle: Math.max(0, Math.min(90, baseValues.panelAngle + variation() * 5)),
    timestamp: new Date().toISOString(),
  };
};

export const healthScoreToColor = (score) => {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
};

export const rolePermissions = {
  admin: ['all'],
  user: ['view_dashboard', 'create_recycling_request', 'view_profile', 'redeem_rewards'],
  recycler: ['view_dashboard', 'manage_requests', 'update_status', 'view_map'],
  manufacturer: ['view_dashboard', 'view_analytics', 'manage_panels'],
};

export const checkPermission = (userRole, permission) => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes('all') || permissions.includes(permission);
};
