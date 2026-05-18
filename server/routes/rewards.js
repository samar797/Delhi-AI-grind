const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Demo rewards data
const userRewards = {
  points: 1250,
  tier: 'gold',
  nextTier: 'platinum',
  pointsToNextTier: 750,
};

const demoTransactions = [
  {
    id: 'txn-001',
    type: 'earned',
    amount: 150,
    description: 'Solar panel recycling completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 1250,
  },
  {
    id: 'txn-002',
    type: 'redeemed',
    amount: -500,
    description: 'Amazon Gift Card $50',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 1100,
  },
  {
    id: 'txn-003',
    type: 'earned',
    amount: 75,
    description: 'Battery recycling completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 1600,
  },
  {
    id: 'txn-004',
    type: 'earned',
    amount: 50,
    description: 'QR Code scan reward',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 1525,
  },
];

const demoCoupons = [
  {
    code: 'SOLAR50',
    title: '$50 Solar Equipment Discount',
    description: 'Get $50 off on solar equipment purchases',
    pointsRequired: 500,
    category: 'equipment',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    available: true,
  },
  {
    code: 'CLEANING20',
    title: '20% Off Panel Cleaning Service',
    description: 'Professional solar panel cleaning at discounted rate',
    pointsRequired: 200,
    category: 'maintenance',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    available: true,
  },
  {
    code: 'AMAZON25',
    title: '$25 Amazon Gift Card',
    description: 'Redeem for Amazon shopping credit',
    pointsRequired: 250,
    category: 'gift_cards',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    available: true,
  },
  {
    code: 'RECYCLE100',
    title: '$100 Recycling Credit',
    description: 'Credit towards future recycling services',
    pointsRequired: 1000,
    category: 'recycling',
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    available: true,
  },
];

// @route   GET /api/rewards/balance
// @desc    Get user rewards balance
// @access  Private
router.get('/balance', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      balance: userRewards,
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/rewards/transactions
// @desc    Get transaction history
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    res.json({
      success: true,
      transactions: demoTransactions.slice(offset, offset + limit),
      total: demoTransactions.length,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/rewards/redeem
// @desc    Redeem coupon
// @access  Private
router.post('/redeem', protect, async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = demoCoupons.find(c => c.code === code);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    if (!coupon.available) {
      return res.status(400).json({
        success: false,
        message: 'Coupon no longer available',
      });
    }

    if (userRewards.points < coupon.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points',
      });
    }

    // Deduct points
    userRewards.points -= coupon.pointsRequired;
    
    // Add transaction
    demoTransactions.unshift({
      id: `txn-${Date.now()}`,
      type: 'redeemed',
      amount: -coupon.pointsRequired,
      description: coupon.title,
      date: new Date().toISOString(),
      balance: userRewards.points,
    });

    res.json({
      success: true,
      message: 'Coupon redeemed successfully!',
      coupon: {
        code: coupon.code,
        title: coupon.title,
        pointsUsed: coupon.pointsRequired,
      },
      newBalance: userRewards.points,
    });
  } catch (error) {
    console.error('Redeem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/rewards/scan
// @desc    Scan QR code for rewards
// @access  Private
router.post('/scan', protect, async (req, res) => {
  try {
    const { qrData } = req.body;
    
    // Simulate QR validation
    const isValid = qrData && (qrData.code || qrData.type);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code',
      });
    }

    // Award points
    const pointsEarned = Math.floor(Math.random() * 30) + 10; // 10-40 points
    userRewards.points += pointsEarned;
    
    demoTransactions.unshift({
      id: `txn-${Date.now()}`,
      type: 'earned',
      amount: pointsEarned,
      description: 'QR Code scan reward',
      date: new Date().toISOString(),
      balance: userRewards.points,
    });

    res.json({
      success: true,
      message: 'QR code scanned successfully!',
      pointsEarned,
      newBalance: userRewards.points,
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/rewards/coupons
// @desc    Get available coupons
// @access  Private
router.get('/coupons', protect, async (req, res) => {
  try {
    const { category } = req.query;
    
    let coupons = [...demoCoupons];
    
    if (category) {
      coupons = coupons.filter(c => c.category === category);
    }

    coupons = coupons.filter(c => c.available);

    res.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
