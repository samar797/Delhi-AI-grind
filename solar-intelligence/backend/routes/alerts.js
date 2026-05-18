const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Alert = require('../models/Alert');

// @route   GET /api/alerts
// @desc    Get user alerts
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { isRead, severity, limit = 50 } = req.query;
    
    const query = { userId: req.userId };
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .populate('panelId', 'name model')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Alert.countDocuments({ 
      userId: req.userId, 
      isRead: false 
    });

    res.json({
      success: true,
      count: alerts.length,
      unreadCount,
      alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/alerts/:id/read
// @desc    Mark alert as read
// @access  Private
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ 
        success: false, 
        message: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      message: 'Alert marked as read',
      alert,
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/alerts/read-all
// @desc    Mark all alerts as read
// @access  Private
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All alerts marked as read',
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete an alert
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!alert) {
      return res.status(404).json({ 
        success: false, 
        message: 'Alert not found' 
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
