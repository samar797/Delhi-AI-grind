const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllPanelsData, getPanelData } = require('../services/iotSimulation');

// @route   GET /api/iot/data
// @desc    Get historical IoT data
// @access  Private
router.get('/data', protect, async (req, res) => {
  try {
    const { panelId, period = '24h' } = req.query;
    
    // Generate demo historical data
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720;
      
      for (let i = hours - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourNum = timestamp.getHours();
        
        // Simulate solar production curve
        const sunFactor = Math.max(0, Math.sin((hourNum - 6) * Math.PI / 12));
        const baseTemp = 35 + sunFactor * 30;
        const baseVoltage = 35 + sunFactor * 8;
        const baseCurrent = 8 + sunFactor * 4;
        const baseEfficiency = 85 + Math.random() * 10;
        
        data.push({
          timestamp: timestamp.toISOString(),
          temperature: parseFloat((baseTemp + (Math.random() - 0.5) * 5).toFixed(2)),
          voltage: parseFloat((baseVoltage + (Math.random() - 0.5) * 2).toFixed(2)),
          current: parseFloat((baseCurrent + (Math.random() - 0.5) * 1).toFixed(2)),
          efficiency: parseFloat(baseEfficiency.toFixed(2)),
          sunlightIntensity: parseFloat((sunFactor * 800 + (Math.random() - 0.5) * 100).toFixed(2)),
          power: parseFloat(((baseVoltage * baseCurrent) + (Math.random() - 0.5) * 20).toFixed(2)),
        });
      }
      
      return data;
    };

    res.json({
      success: true,
      data: generateHistoricalData(),
      period,
    });
  } catch (error) {
    console.error('Get IoT data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/iot/realtime/:panelId
// @desc    Get real-time IoT data
// @access  Private
router.get('/realtime/:panelId', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.panelId);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    res.json({
      success: true,
      data: panel.currentMetrics,
      panelId: req.params.panelId,
    });
  } catch (error) {
    console.error('Get realtime data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
