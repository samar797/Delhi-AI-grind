const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Demo awareness posts
const demoPosts = [
  {
    id: 'post-001',
    title: 'Maximizing Your Solar Panel Efficiency',
    excerpt: 'Learn the top 5 ways to keep your solar panels operating at peak performance year-round.',
    content: 'Regular maintenance is key to maximizing solar panel efficiency...',
    category: 'tips',
    image: '/images/solar-tips.jpg',
    author: 'Dr. Sarah Green',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 5,
    likes: 234,
    tags: ['efficiency', 'maintenance', 'tips'],
  },
  {
    id: 'post-002',
    title: 'The Importance of Solar Recycling',
    excerpt: 'Discover why proper solar panel disposal matters for our planet\'s future.',
    content: 'As solar panels reach end-of-life, proper recycling becomes crucial...',
    category: 'awareness',
    image: '/images/recycling.jpg',
    author: 'EcoWarrior Team',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 8,
    likes: 567,
    tags: ['recycling', 'sustainability', 'environment'],
  },
  {
    id: 'post-003',
    title: 'Solar Energy Impact Report 2024',
    excerpt: 'Our community has reduced carbon emissions by over 10,000 tons this year!',
    content: 'Thanks to our amazing community of solar adopters...',
    category: 'impact',
    image: '/images/impact-report.jpg',
    author: 'Solar Intelligence',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 10,
    likes: 892,
    tags: ['impact', 'statistics', 'community'],
  },
];

// Demo sustainability stats
const sustainabilityStats = {
  totalCarbonReduced: 12450, // tons
  totalEnergyGenerated: 45678, // MWh
  totalRecycled: 3456, // tons
  activeUsers: 15234,
  treesEquivalent: 567890,
  homesPowered: 8934,
};

// @route   GET /api/awareness/posts
// @desc    Get all awareness posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    let posts = [...demoPosts];
    
    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    res.json({
      success: true,
      count: posts.length,
      posts: posts.slice(0, parseInt(limit)),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/awareness/posts/:id
// @desc    Get single post
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = demoPosts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/awareness/posts
// @desc    Create new post (admin only)
// @access  Private/Admin
router.post('/posts', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const newPost = {
      id: `post-${Date.now()}`,
      ...req.body,
      publishedAt: new Date().toISOString(),
      likes: 0,
    };

    demoPosts.unshift(newPost);

    res.status(201).json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/awareness/stats
// @desc    Get sustainability statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    res.json({
      success: true,
      stats: sustainabilityStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
