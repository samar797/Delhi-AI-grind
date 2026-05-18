const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Simulated rewards data
let userRewards = {};

// @route   GET /api/rewards/balance
// @desc    Get user reward balance
// @access  Private
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const balance = userRewards[req.userId] || 0;
    
    res.json({
      success: true,
      balance,
      currency: 'SolarPoints',
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/rewards/transactions
// @desc    Get reward transactions
// @access  Private
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    // Simulated transactions
    const transactions = [
      { id: 1, type: 'earn', amount: 100, description: 'Solar energy generation bonus', date: new Date() },
      { id: 2, type: 'earn', amount: 50, description: 'Recycling reward', date: new Date(Date.now() - 86400000) },
      { id: 3, type: 'redeem', amount: -200, description: 'Coupon redemption', date: new Date(Date.now() - 172800000) },
    ];

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/rewards/redeem
// @desc    Redeem reward coupon
// @access  Private
router.post('/redeem', authMiddleware, async (req, res) => {
  try {
    const { couponCode } = req.body;
    
    if (!couponCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon code required' 
      });
    }

    // Simulated coupon validation
    const validCoupons = {
      'SOLAR10': { discount: 10, cost: 100 },
      'SOLAR20': { discount: 20, cost: 200 },
      'ECO50': { discount: 50, cost: 500 },
    };

    const coupon = validCoupons[couponCode];
    if (!coupon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coupon code' 
      });
    }

    const currentBalance = userRewards[req.userId] || 0;
    if (currentBalance < coupon.cost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient points' 
      });
    }

    userRewards[req.userId] = currentBalance - coupon.cost;

    res.json({
      success: true,
      message: `Coupon redeemed! ${coupon.discount}% discount applied`,
      remainingBalance: userRewards[req.userId],
    });
  } catch (error) {
    console.error('Redeem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/rewards/scan
// @desc    Scan QR code for rewards
// @access  Private
router.post('/scan', authMiddleware, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ 
        success: false, 
        message: 'QR data required' 
      });
    }

    // Simulated QR scan reward
    const reward = Math.floor(Math.random() * 50) + 10;
    userRewards[req.userId] = (userRewards[req.userId] || 0) + reward;

    res.json({
      success: true,
      message: `QR code scanned! You earned ${reward} SolarPoints`,
      earned: reward,
      newBalance: userRewards[req.userId],
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
