const SolarPanel = require('../models/SolarPanel');
const Alert = require('../models/Alert');
const { simulateIoTData } = require('../utils/helpers');

// Store active panels and their base values
const activePanels = new Map();

// Initialize demo panels with base values
function initializeDemoPanels() {
  const demoPanels = [
    {
      panelId: 'SP-DEMO-001',
      model: 'SolarMax Pro 400W',
      manufacturer: 'GreenTech Industries',
      baseMetrics: {
        temperature: 45,
        voltage: 38,
        current: 10.5,
        efficiency: 92,
        sunlightIntensity: 800,
        panelAngle: 45,
      },
    },
    {
      panelId: 'SP-DEMO-002',
      model: 'EcoSun Elite 350W',
      manufacturer: 'SolarWorks',
      baseMetrics: {
        temperature: 42,
        voltage: 36,
        current: 9.7,
        efficiency: 88,
        sunlightIntensity: 750,
        panelAngle: 40,
      },
    },
    {
      panelId: 'SP-DEMO-003',
      model: 'PowerPlate X 450W',
      manufacturer: 'RenewableCorp',
      baseMetrics: {
        temperature: 48,
        voltage: 40,
        current: 11.2,
        efficiency: 95,
        sunlightIntensity: 850,
        panelAngle: 50,
      },
    },
  ];

  demoPanels.forEach(panel => {
    activePanels.set(panel.panelId, {
      ...panel,
      lastUpdate: Date.now(),
      healthScore: 100,
      alerts: [],
    });
  });

  return demoPanels;
}

// Generate random issues for simulation
function generateRandomIssue(panel) {
  const issues = [
    {
      type: 'dust_detected',
      title: 'Dust Accumulation Detected',
      message: 'Dust levels exceeding threshold. Cleaning recommended.',
      severity: 'medium',
      recommendation: 'Schedule panel cleaning within 48 hours',
      condition: () => Math.random() < 0.05, // 5% chance
    },
    {
      type: 'overheating',
      title: 'Overheating Warning',
      message: 'Panel temperature exceeding safe operating range.',
      severity: 'high',
      recommendation: 'Check ventilation and reduce load if possible',
      condition: () => panel.currentMetrics.temperature > 70,
    },
    {
      type: 'efficiency_drop',
      title: 'Efficiency Drop Detected',
      message: 'Panel efficiency below expected threshold.',
      severity: 'medium',
      recommendation: 'Inspect for shading or damage',
      condition: () => panel.currentMetrics.efficiency < 70,
    },
    {
      type: 'voltage_fluctuation',
      title: 'Voltage Fluctuation',
      message: 'Irregular voltage output detected.',
      severity: 'low',
      recommendation: 'Monitor closely, check connections',
      condition: () => Math.random() < 0.03, // 3% chance
    },
    {
      type: 'performance_issue',
      title: 'Performance Issue',
      message: 'Panel not meeting expected performance metrics.',
      severity: 'medium',
      recommendation: 'Schedule maintenance inspection',
      condition: () => Math.random() < 0.02, // 2% chance
    },
  ];

  return issues.find(issue => issue.condition());
}

// Update panel metrics
function updatePanelMetrics(panelData, io) {
  const panel = activePanels.get(panelData.panelId);
  
  if (!panel) return;

  // Simulate time-based changes (sun movement, weather)
  const hour = new Date().getHours();
  const sunFactor = Math.max(0, Math.sin((hour - 6) * Math.PI / 12)); // Peak at noon
  
  // Add some randomness and time-based variation
  const updatedMetrics = {
    temperature: Math.min(80, panel.baseMetrics.temperature + (sunFactor * 20) + (Math.random() - 0.5) * 5),
    voltage: Math.max(0, panel.baseMetrics.voltage + (sunFactor * 5) + (Math.random() - 0.5) * 2),
    current: Math.max(0, panel.baseMetrics.current + (sunFactor * 3) + (Math.random() - 0.5) * 1),
    efficiency: Math.max(0, Math.min(100, panel.baseMetrics.efficiency + (Math.random() - 0.5) * 3)),
    sunlightIntensity: Math.max(0, Math.min(1000, panel.baseMetrics.sunlightIntensity * sunFactor + (Math.random() - 0.5) * 50)),
    panelAngle: Math.max(0, Math.min(90, panel.baseMetrics.panelAngle + (Math.random() - 0.5) * 2)),
  };

  panel.currentMetrics = {
    ...updatedMetrics,
    power: updatedMetrics.voltage * updatedMetrics.current,
    healthScore: Math.max(0, Math.min(100, panel.healthScore)),
    lastUpdated: new Date().toISOString(),
  };

  // Check for issues
  const issue = generateRandomIssue(panel);
  if (issue) {
    createAlert(panelData.panelId, issue, io);
  }

  // Emit real-time update
  io.emit('iot:data', {
    panelId: panelData.panelId,
    metrics: panel.currentMetrics,
    timestamp: new Date().toISOString(),
  });

  io.emit(`panel:${panelData.panelId}:update`, panel.currentMetrics);

  panel.lastUpdate = Date.now();
}

// Create alert
async function createAlert(panelId, issue, io) {
  try {
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      panelId,
      type: issue.type,
      severity: issue.severity,
      title: issue.title,
      message: issue.message,
      recommendation: issue.recommendation,
      metrics: {},
      status: 'new',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    // In production, save to database
    // const savedAlert = await Alert.create({...});

    // Emit alert to connected clients
    io.emit('alert:new', alert);
    io.emit('dashboard:update', { type: 'new_alert', alert });

    console.log(`🚨 Alert generated for ${panelId}: ${issue.title}`);
  } catch (error) {
    console.error('Error creating alert:', error);
  }
}

// Start simulation
function startSimulation(io) {
  console.log('🔄 Starting IoT simulation...');
  
  // Initialize demo panels
  const panels = initializeDemoPanels();
  console.log(`✅ Initialized ${panels.length} demo panels`);

  // Update metrics every 5 seconds
  setInterval(() => {
    activePanels.forEach((panel, panelId) => {
      updatePanelMetrics({ panelId }, io);
    });
  }, 5000);

  // Emit dashboard updates every 10 seconds
  setInterval(() => {
    const dashboardData = {
      totalPanels: activePanels.size,
      activePanels: Array.from(activePanels.values()).filter(p => p.currentMetrics.efficiency > 0).length,
      averageEfficiency: Array.from(activePanels.values())
        .reduce((sum, p) => sum + p.currentMetrics.efficiency, 0) / activePanels.size,
      totalEnergy: Array.from(activePanels.values())
        .reduce((sum, p) => sum + p.currentMetrics.power, 0),
      alerts: Array.from(activePanels.values())
        .reduce((sum, p) => sum + (p.alerts?.length || 0), 0),
    };

    io.emit('dashboard:update', dashboardData);
  }, 10000);

  return activePanels;
}

// Get panel data
function getPanelData(panelId) {
  return activePanels.get(panelId);
}

// Get all panels data
function getAllPanelsData() {
  return Array.from(activePanels.entries()).map(([id, data]) => ({
    panelId: id,
    ...data,
  }));
}

module.exports = {
  startSimulation,
  getPanelData,
  getAllPanelsData,
  activePanels,
};
