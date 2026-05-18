const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllPanelsData, getPanelData } = require('../services/iotSimulation');

// @route   GET /api/solar/panels
// @desc    Get all solar panels
// @access  Private
router.get('/panels', protect, async (req, res) => {
  try {
    const panels = getAllPanelsData();
    
    res.json({
      success: true,
      count: panels.length,
      panels,
    });
  } catch (error) {
    console.error('Get panels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/solar/panels/:id
// @desc    Get single panel
// @access  Private
router.get('/panels/:id', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.id);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    res.json({
      success: true,
      panel,
    });
  } catch (error) {
    console.error('Get panel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/solar/panels/:id/metrics
// @desc    Get panel live metrics
// @access  Private
router.get('/panels/:id/metrics', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.id);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    res.json({
      success: true,
      metrics: panel.currentMetrics,
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
