const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const SolarPanel = require('../models/SolarPanel');
const IoTData = require('../models/IoTData');
const Alert = require('../models/Alert');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const panels = await SolarPanel.find({ userId: req.userId });
    const panelIds = panels.map(p => p._id);

    // Calculate total energy generated
    const totalEnergy = panels.reduce((sum, panel) => sum + (panel.totalEnergyGenerated || 0), 0);
    
    // Calculate average efficiency
    const avgEfficiency = panels.length > 0 
      ? panels.reduce((sum, panel) => sum + (panel.currentData.efficiency || 0), 0) / panels.length 
      : 0;

    // Calculate total carbon offset
    const totalCarbonOffset = panels.reduce((sum, panel) => sum + (panel.carbonOffset || 0), 0);

    // Get active alerts count
    const unreadAlerts = await Alert.countDocuments({ 
      userId: req.userId, 
      isRead: false 
    });

    // Get recent alerts
    const recentAlerts = await Alert.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalPanels: panels.length,
        activePanels: panels.filter(p => p.status === 'Active').length,
        totalEnergyGenerated: totalEnergy.toFixed(2),
        averageEfficiency: avgEfficiency.toFixed(1),
        totalCarbonOffset: totalCarbonOffset.toFixed(2),
        unreadAlerts,
        recentAlerts,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/dashboard/energy
// @desc    Get energy data for charts
// @access  Private
router.get('/energy', authMiddleware, async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    const panels = await SolarPanel.find({ userId: req.userId });
    const panelIds = panels.map(p => p._id);

    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const energyData = await IoTData.aggregate([
      {
        $match: {
          panelId: { $in: panelIds },
          timestamp: { $gte: startDate },
        },
      },
      {
        $sort: { timestamp: 1 },
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          },
          totalEnergy: { $sum: '$energyGenerated' },
          avgEfficiency: { $avg: '$efficiency' },
          avgTemperature: { $avg: '$temperature' },
        },
      },
      {
        $sort: { '_id.date': 1, '_id.hour': 1 },
      },
    ]);

    res.json({
      success: true,
      data: energyData,
    });
  } catch (error) {
    console.error('Energy data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/dashboard/efficiency
// @desc    Get efficiency metrics
// @access  Private
router.get('/efficiency', authMiddleware, async (req, res) => {
  try {
    const panels = await SolarPanel.find({ userId: req.userId });

    const efficiencyMetrics = panels.map(panel => ({
      panelId: panel._id,
      panelName: panel.name,
      currentEfficiency: panel.currentData.efficiency,
      healthScore: panel.healthScore,
      status: panel.status,
      lastUpdated: panel.updatedAt,
    }));

    res.json({
      success: true,
      metrics: efficiencyMetrics,
    });
  } catch (error) {
    console.error('Efficiency error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
