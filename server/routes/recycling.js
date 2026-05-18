const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Demo recyclers data
const demoRecyclers = [
  {
    id: 'recycler-001',
    companyName: 'GreenCycle Solutions',
    rating: 4.8,
    reviews: 127,
    specialization: ['solar_panels', 'batteries'],
    location: {
      address: '123 Eco Street, San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    pricing: { baseRate: 2.5, pickupFee: 50 },
    isVerified: true,
    distance: 2.3,
  },
  {
    id: 'recycler-002',
    companyName: 'SolarRecycle Pro',
    rating: 4.6,
    reviews: 89,
    specialization: ['solar_panels', 'inverters'],
    location: {
      address: '456 Green Ave, Oakland, CA',
      coordinates: { lat: 37.8044, lng: -122.2712 },
    },
    pricing: { baseRate: 2.8, pickupFee: 40 },
    isVerified: true,
    distance: 5.7,
  },
  {
    id: 'recycler-003',
    companyName: 'EcoWaste Management',
    rating: 4.9,
    reviews: 203,
    specialization: ['all'],
    location: {
      address: '789 Renewable Blvd, San Jose, CA',
      coordinates: { lat: 37.3382, lng: -121.8863 },
    },
    pricing: { baseRate: 3.0, pickupFee: 60 },
    isVerified: true,
    distance: 8.2,
  },
];

// Demo recycling requests
const demoRequests = [
  {
    id: 'req-001',
    requestType: 'panel_disposal',
    status: 'pickup_scheduled',
    items: [{ type: 'solar_panel', quantity: 4, weight: 80 }],
    pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    recycler: 'recycler-001',
    rewardsPoints: 150,
  },
  {
    id: 'req-002',
    requestType: 'battery_recycling',
    status: 'completed',
    items: [{ type: 'battery', quantity: 2, weight: 30 }],
    pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    recycler: 'recycler-002',
    rewardsPoints: 75,
  },
];

// @route   GET /api/recycling/recyclers
// @desc    Get all recyclers
// @access  Private
router.get('/recyclers', protect, async (req, res) => {
  try {
    const { location, specialization, radius = 10 } = req.query;
    
    let recyclers = [...demoRecyclers];
    
    if (specialization) {
      recyclers = recyclers.filter(r => 
        r.specialization.includes(specialization) || r.specialization.includes('all')
      );
    }

    res.json({
      success: true,
      count: recyclers.length,
      recyclers,
    });
  } catch (error) {
    console.error('Get recyclers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/recycling/request
// @desc    Create recycling request
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { requestType, items, pickupAddress, preferredPickupDate } = req.body;

    const newRequest = {
      id: `req-${Date.now()}`,
      user: req.user.id,
      requestType,
      items,
      pickupAddress,
      preferredPickupDate,
      status: 'requested',
      createdAt: new Date().toISOString(),
      trackingHistory: [{
        status: 'requested',
        timestamp: new Date().toISOString(),
        notes: 'Request created',
      }],
      rewardsPoints: items.reduce((sum, item) => sum + (item.weight || 10) * 2, 0),
    };

    demoRequests.push(newRequest);

    res.status(201).json({
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/recycling/requests
// @desc    Get user recycling requests
// @access  Private
router.get('/requests', protect, async (req, res) => {
  try {
    const userRequests = demoRequests.filter(r => !r.recycler || true); // Demo: show all
    
    res.json({
      success: true,
      count: userRequests.length,
      requests: userRequests,
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   PUT /api/recycling/requests/:id/status
// @desc    Update request status
// @access  Private
router.put('/requests/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const request = demoRequests.find(r => r.id === req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = status;
    request.trackingHistory.push({
      status,
      timestamp: new Date().toISOString(),
      notes: `Status updated to ${status}`,
    });

    res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/recycling/requests/:id/track
// @desc    Track recycling request
// @access  Private
router.get('/requests/:id/track', protect, async (req, res) => {
  try {
    const request = demoRequests.find(r => r.id === req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.json({
      success: true,
      tracking: {
        requestId: request.id,
        status: request.status,
        history: request.trackingHistory,
        estimatedCompletion: request.status === 'recycling_started' 
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error('Track request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
