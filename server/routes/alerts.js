const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Demo alerts store
const demoAlerts = [
  {
    id: 'alert-001',
    panelId: 'SP-DEMO-001',
    type: 'dust_detected',
    severity: 'medium',
    title: 'Dust Accumulation Detected',
    message: 'Dust levels exceeding threshold. Cleaning recommended.',
    recommendation: 'Schedule panel cleaning within 48 hours',
    status: 'new',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert-002',
    panelId: 'SP-DEMO-002',
    type: 'efficiency_drop',
    severity: 'medium',
    title: 'Efficiency Drop Detected',
    message: 'Panel efficiency below expected threshold.',
    recommendation: 'Inspect for shading or damage',
    status: 'acknowledged',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert-003',
    panelId: 'SP-DEMO-003',
    type: 'overheating',
    severity: 'high',
    title: 'Overheating Warning',
    message: 'Panel temperature exceeding safe operating range.',
    recommendation: 'Check ventilation and reduce load if possible',
    status: 'new',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// @route   GET /api/alerts
// @desc    Get all alerts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    
    let alerts = [...demoAlerts];
    
    if (status !== 'all') {
      alerts = alerts.filter(a => a.status === status || (status === 'unread' && !a.isRead));
    }

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/alerts/:id/read
// @desc    Mark alert as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const alert = demoAlerts.find(a => a.id === req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    alert.isRead = true;
    alert.status = 'acknowledged';

    res.json({
      success: true,
      alert,
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/alerts/read-all
// @desc    Mark all alerts as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    demoAlerts.forEach(alert => {
      alert.isRead = true;
      if (alert.status === 'new') {
        alert.status = 'acknowledged';
      }
    });

    res.json({
      success: true,
      count: demoAlerts.length,
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const index = demoAlerts.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    demoAlerts.splice(index, 1);

    res.json({
      success: true,
      message: 'Alert deleted',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
