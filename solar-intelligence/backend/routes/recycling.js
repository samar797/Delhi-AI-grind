const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const Recycler = require('../models/Recycler');
const RecyclingRequest = require('../models/RecyclingRequest');

// @route   GET /api/recycling/recyclers
// @desc    Get all recyclers
// @access  Public
router.get('/recyclers', async (req, res) => {
  try {
    const { isActive = true, certification, limit = 50 } = req.query;
    
    const query = {};
    if (isActive !== 'false') query.isActive = isActive === 'true' ? true : undefined;
    if (certification) query.certification = certification;

    const recyclers = await Recycler.find(query)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: recyclers.length,
      recyclers,
    });
  } catch (error) {
    console.error('Get recyclers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recycling/recyclers/nearby
// @desc    Get nearby recyclers by location
// @access  Public
router.get('/recyclers/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const recyclers = await Recycler.find({
      isActive: true,
      geoLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius) * 1000, // Convert km to meters
        },
      },
    }).limit(20);

    res.json({
      success: true,
      count: recyclers.length,
      recyclers,
    });
  } catch (error) {
    console.error('Nearby recyclers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recycling/recyclers/:id
// @desc    Get recycler by ID
// @access  Public
router.get('/recyclers/:id', async (req, res) => {
  try {
    const recycler = await Recycler.findById(req.params.id);

    if (!recycler) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recycler not found' 
      });
    }

    res.json({
      success: true,
      recycler,
    });
  } catch (error) {
    console.error('Get recycler error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/recycling/requests
// @desc    Create recycling request
// @access  Private
router.post('/requests', authMiddleware, async (req, res) => {
  try {
    const {
      recyclerId,
      panelId,
      requestType = 'Pickup',
      materials = [],
      totalWeight,
      pickupLocation,
      preferredDate,
      notes,
    } = req.body;

    if (!recyclerId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recycler ID is required' 
      });
    }

    const request = new RecyclingRequest({
      userId: req.userId,
      recyclerId,
      panelId,
      requestType,
      materials,
      totalWeight: totalWeight || 0,
      pickupLocation,
      preferredDate,
      notes,
      trackingHistory: [{
        status: 'Requested',
        note: 'Recycling request created',
        updatedBy: req.userId,
      }],
    });

    await request.save();

    // Populate recycler info
    await request.populate('recyclerId', 'companyName contactInfo');

    res.status(201).json({
      success: true,
      message: 'Recycling request created successfully',
      request,
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recycling/requests
// @desc    Get user's recycling requests
// @access  Private
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { userId: req.userId };
    if (status) query.status = status;

    const requests = await RecyclingRequest.find(query)
      .populate('recyclerId', 'companyName contactInfo location')
      .populate('panelId', 'name model')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/recycling/requests/:id/status
// @desc    Update recycling request status
// @access  Private (Recycler/Admin)
router.put('/requests/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Requested', 'Confirmed', 'Pickup Scheduled', 'In Transit', 'Recycling Started', 'Recycled Successfully', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const request = await RecyclingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    request.status = status;
    request.trackingHistory.push({
      status,
      note: `Status updated to ${status}`,
      updatedBy: req.userId,
    });

    if (status === 'Recycled Successfully') {
      request.completedDate = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      request,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
