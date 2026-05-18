const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const AwarenessPost = require('../models/AwarenessPost');

// @route   GET /api/awareness/posts
// @desc    Get awareness posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, limit = 20, isFeatured } = req.query;
    
    const query = { isPublished: true };
    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const posts = await AwarenessPost.find(query)
      .populate('author', 'name profileImage')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/awareness/posts
// @desc    Create awareness post
// @access  Private (Admin)
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'Education',
      featuredImage,
      images = [],
      tags = [],
      impactMetrics,
      callToAction,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }

    const post = new AwarenessPost({
      title,
      content,
      category,
      author: req.userId,
      featuredImage,
      images,
      tags,
      impactMetrics,
      callToAction,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/awareness/stats
// @desc    Get awareness statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalPosts = await AwarenessPost.countDocuments({ isPublished: true });
    const totalViews = await AwarenessPost.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    const categoryStats = await AwarenessPost.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalPosts,
        totalViews: totalViews[0]?.total || 0,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
