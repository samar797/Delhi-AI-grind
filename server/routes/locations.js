const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Demo machine locations
const demoLocations = [
  {
    id: 'machine-001',
    name: 'Solar Hub Downtown',
    type: 'monitoring_station',
    status: 'active',
    location: {
      address: '100 Market Street, San Francisco, CA',
      coordinates: { lat: 37.7939, lng: -122.3959 },
    },
    metrics: {
      panelsMonitored: 45,
      totalCapacity: '18 kW',
      currentOutput: '14.2 kW',
      efficiency: 92,
    },
  },
  {
    id: 'machine-002',
    name: 'Recycling Center North',
    type: 'recycling_facility',
    status: 'active',
    location: {
      address: '500 Industrial Blvd, Oakland, CA',
      coordinates: { lat: 37.8044, lng: -122.2712 },
    },
    metrics: {
      capacity: '50 tons/month',
      currentLoad: '32 tons',
      processingTime: '7-10 days',
      rating: 4.8,
    },
  },
  {
    id: 'machine-003',
    name: 'Solar Farm East Bay',
    type: 'solar_farm',
    status: 'active',
    location: {
      address: '2000 Renewable Way, Berkeley, CA',
      coordinates: { lat: 37.8716, lng: -122.2727 },
    },
    metrics: {
      panelsMonitored: 250,
      totalCapacity: '100 kW',
      currentOutput: '87.5 kW',
      efficiency: 89,
    },
  },
  {
    id: 'machine-004',
    name: 'Community Solar South',
    type: 'community_array',
    status: 'maintenance',
    location: {
      address: '750 Green Street, San Jose, CA',
      coordinates: { lat: 37.3382, lng: -121.8863 },
    },
    metrics: {
      panelsMonitored: 120,
      totalCapacity: '48 kW',
      currentOutput: '0 kW',
      efficiency: 0,
    },
  },
];

// @route   GET /api/locations/machines
// @desc    Get all machine locations
// @access  Private
router.get('/machines', protect, async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let locations = [...demoLocations];
    
    if (type) {
      locations = locations.filter(l => l.type === type);
    }
    
    if (status) {
      locations = locations.filter(l => l.status === status);
    }

    res.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    console.error('Get machines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/locations/nearby
// @desc    Get nearby recyclers/facilities
// @access  Private
router.get('/nearby', protect, async (req, res) => {
  try {
    const { lat, lng, radius = 10, type } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required',
      });
    }

    // Calculate distances (simple Euclidean for demo)
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    
    let locations = demoLocations.map(loc => {
      const dLat = loc.location.coordinates.lat - userLat;
      const dLng = loc.location.coordinates.lng - userLng;
      const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // Rough km conversion
      
      return { ...loc, distance: parseFloat(distance.toFixed(2)) };
    });
    
    // Filter by radius
    locations = locations.filter(l => l.distance <= radius);
    
    // Filter by type if specified
    if (type) {
      locations = locations.filter(l => l.type === type);
    }
    
    // Sort by distance
    locations.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: locations.length,
      locations,
      searchParams: { lat: userLat, lng: userLng, radius },
    });
  } catch (error) {
    console.error('Get nearby error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/locations/route
// @desc    Calculate route between points
// @access  Private
router.get('/route', protect, async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'Start and end points required',
      });
    }

    // Parse coordinates
    const [startLat, startLng] = start.split(',').map(Number);
    const [endLat, endLng] = end.split(',').map(Number);
    
    // Calculate distance and estimated time (demo)
    const dLat = endLat - startLat;
    const dLng = endLng - startLng;
    const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
    const estimatedTime = Math.round(distance / 40 * 60); // Assuming 40 km/h avg speed

    res.json({
      success: true,
      route: {
        start: { lat: startLat, lng: startLng },
        end: { lat: endLat, lng: endLng },
        distance: parseFloat(distance.toFixed(2)),
        unit: 'km',
        estimatedTime,
        estimatedTimeUnit: 'minutes',
        traffic: 'moderate',
        alternatives: [
          {
            name: 'Fastest Route',
            distance: parseFloat(distance.toFixed(2)),
            time: estimatedTime,
          },
          {
            name: 'Eco Route',
            distance: parseFloat((distance * 1.1).toFixed(2)),
            time: Math.round(estimatedTime * 1.15),
          },
        ],
      },
    });
  } catch (error) {
    console.error('Calculate route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
