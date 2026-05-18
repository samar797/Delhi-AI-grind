const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllPanelsData, getPanelData } = require('../services/iotSimulation');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // Demo data - in production, fetch from database
    const stats = {
      totalEnergy: 1247.5, // kWh
      currentEfficiency: 87.3, // %
      carbonReduction: 892, // kg CO2
      activePanels: 3,
      totalPanels: 3,
      recyclingRequests: 5,
      rewardsPoints: 1250,
      alerts: {
        total: 8,
        unread: 3,
        critical: 1,
      },
      sustainability: {
        treesEquivalent: 42,
        carsOffRoad: 0.5,
        homesPowered: 1.2,
      },
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/dashboard/energy
// @desc    Get energy data
// @access  Private
router.get('/energy', protect, async (req, res) => {
  try {
    const { period = 'day' } = req.query;
    
    // Generate demo energy data
    const generateHourlyData = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourNum = hour.getHours();
        
        // Simulate solar production curve (peak at noon)
        const sunFactor = Math.max(0, Math.sin((hourNum - 6) * Math.PI / 12));
        const baseProduction = 50 + Math.random() * 30;
        
        data.push({
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          production: parseFloat((baseProduction * sunFactor).toFixed(2)),
          consumption: parseFloat((30 + Math.random() * 20).toFixed(2)),
          grid: parseFloat((Math.random() * 10).toFixed(2)),
        });
      }
      
      return data;
    };

    const energyData = {
      period,
      data: generateHourlyData(),
      summary: {
        totalProduced: parseFloat((Math.random() * 50 + 30).toFixed(2)),
        totalConsumed: parseFloat((Math.random() * 30 + 20).toFixed(2)),
        netExport: parseFloat((Math.random() * 20 + 5).toFixed(2)),
        peakProduction: parseFloat((Math.random() * 10 + 5).toFixed(2)),
      },
    };

    res.json({
      success: true,
      energyData,
    });
  } catch (error) {
    console.error('Get energy data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/dashboard/carbon
// @desc    Get carbon reduction data
// @access  Private
router.get('/carbon', protect, async (req, res) => {
  try {
    const carbonData = {
      totalReduction: 892, // kg CO2
      monthlyReduction: [
        { month: 'Jan', reduction: 65 },
        { month: 'Feb', reduction: 72 },
        { month: 'Mar', reduction: 78 },
        { month: 'Apr', reduction: 85 },
        { month: 'May', reduction: 92 },
        { month: 'Jun', reduction: 98 },
      ],
      equivalents: {
        treesPlanted: 42,
        milesNotDriven: 2234,
        gallonsOfGasSaved: 98,
        coalNotBurned: 445, // lbs
      },
    };

    res.json({
      success: true,
      carbonData,
    });
  } catch (error) {
    console.error('Get carbon data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
