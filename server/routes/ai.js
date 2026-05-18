const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllPanelsData, getPanelData } = require('../services/iotSimulation');

// AI Analysis rules
const analyzePanelHealth = (metrics) => {
  let healthScore = 100;
  const issues = [];
  
  // Temperature analysis
  if (metrics.temperature > 70) {
    healthScore -= 20;
    issues.push({ type: 'overheating', severity: 'high', message: 'High temperature detected' });
  } else if (metrics.temperature > 60) {
    healthScore -= 10;
    issues.push({ type: 'warm', severity: 'low', message: 'Elevated temperature' });
  }
  
  // Efficiency analysis
  if (metrics.efficiency < 70) {
    healthScore -= 25;
    issues.push({ type: 'low_efficiency', severity: 'high', message: 'Significant efficiency drop' });
  } else if (metrics.efficiency < 80) {
    healthScore -= 15;
    issues.push({ type: 'reduced_efficiency', severity: 'medium', message: 'Reduced efficiency' });
  }
  
  // Voltage analysis
  if (metrics.voltage < 30 || metrics.voltage > 45) {
    healthScore -= 15;
    issues.push({ type: 'voltage_issue', severity: 'medium', message: 'Voltage outside normal range' });
  }
  
  // Current analysis
  if (metrics.current < 5) {
    healthScore -= 10;
    issues.push({ type: 'low_current', severity: 'medium', message: 'Low current output' });
  }
  
  return {
    healthScore: Math.max(0, healthScore),
    issues,
    status: healthScore >= 90 ? 'excellent' : healthScore >= 70 ? 'good' : healthScore >= 50 ? 'fair' : 'poor',
  };
};

const generateRecommendations = (panelId, metrics, analysis) => {
  const recommendations = [];
  
  analysis.issues.forEach(issue => {
    switch (issue.type) {
      case 'overheating':
        recommendations.push({
          priority: 'high',
          action: 'Check ventilation and cooling systems',
          description: 'Panel temperature is exceeding safe operating levels. Ensure proper airflow and consider installing additional cooling.',
        });
        break;
      case 'low_efficiency':
      case 'reduced_efficiency':
        recommendations.push({
          priority: 'medium',
          action: 'Schedule panel cleaning',
          description: 'Dust or debris may be blocking sunlight. Clean panels to restore optimal performance.',
        });
        recommendations.push({
          priority: 'medium',
          action: 'Inspect for shading',
          description: 'Check for new obstructions that may be casting shadows on the panel.',
        });
        break;
      case 'voltage_issue':
        recommendations.push({
          priority: 'high',
          action: 'Check electrical connections',
          description: 'Voltage irregularities may indicate loose connections or wiring issues.',
        });
        break;
      case 'low_current':
        recommendations.push({
          priority: 'medium',
          action: 'Inspect panel for damage',
          description: 'Low current output may indicate cell damage or degradation.',
        });
        break;
    }
  });
  
  // Add preventive maintenance recommendation
  if (analysis.healthScore >= 90) {
    recommendations.push({
      priority: 'low',
      action: 'Continue regular monitoring',
      description: 'Panel is performing well. Maintain current maintenance schedule.',
    });
  }
  
  return recommendations;
};

// @route   GET /api/ai/analyze/:panelId
// @desc    Analyze panel efficiency
// @access  Private
router.get('/analyze/:panelId', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.panelId);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    const analysis = analyzePanelHealth(panel.currentMetrics);
    const recommendations = generateRecommendations(req.params.panelId, panel.currentMetrics, analysis);

    res.json({
      success: true,
      analysis: {
        panelId: req.params.panelId,
        timestamp: new Date().toISOString(),
        metrics: panel.currentMetrics,
        healthScore: analysis.healthScore,
        status: analysis.status,
        issues: analysis.issues,
        recommendations,
      },
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/ai/predictions/:panelId
// @desc    Get AI predictions
// @access  Private
router.get('/predictions/:panelId', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.panelId);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    // Demo predictions
    const predictions = {
      panelId: req.params.panelId,
      generatedAt: new Date().toISOString(),
      next24Hours: {
        expectedEnergy: parseFloat((Math.random() * 20 + 30).toFixed(2)),
        peakTime: '12:00-14:00',
        weatherImpact: 'minimal',
        confidence: 87,
      },
      nextWeek: {
        expectedEnergy: parseFloat((Math.random() * 100 + 150).toFixed(2)),
        maintenanceNeeded: Math.random() < 0.3,
        efficiencyTrend: 'stable',
        confidence: 72,
      },
      nextMonth: {
        expectedEnergy: parseFloat((Math.random() * 300 + 400).toFixed(2)),
        degradationRate: 0.5,
        recommendedActions: ['Schedule cleaning', 'Inspect connections'],
      },
    };

    res.json({
      success: true,
      predictions,
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/ai/maintenance/:panelId
// @desc    Get maintenance recommendations
// @access  Private
router.get('/maintenance/:panelId', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.panelId);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    const analysis = analyzePanelHealth(panel.currentMetrics);
    const recommendations = generateRecommendations(req.params.panelId, panel.currentMetrics, analysis);

    res.json({
      success: true,
      maintenance: {
        panelId: req.params.panelId,
        currentHealth: analysis.healthScore,
        urgentActions: recommendations.filter(r => r.priority === 'high'),
        scheduledActions: recommendations.filter(r => r.priority === 'medium'),
        preventiveActions: recommendations.filter(r => r.priority === 'low'),
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextRecommended: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   GET /api/ai/health/:panelId
// @desc    Get health score
// @access  Private
router.get('/health/:panelId', protect, async (req, res) => {
  try {
    const panel = getPanelData(req.params.panelId);
    
    if (!panel) {
      return res.status(404).json({
        success: false,
        message: 'Panel not found',
      });
    }

    const analysis = analyzePanelHealth(panel.currentMetrics);

    res.json({
      success: true,
      health: {
        panelId: req.params.panelId,
        score: analysis.healthScore,
        status: analysis.status,
        breakdown: {
          temperature: analysis.issues.some(i => i.type.includes('temp')) ? 70 : 100,
          efficiency: analysis.issues.some(i => i.type.includes('efficiency')) ? 75 : 100,
          electrical: analysis.issues.some(i => i.type.includes('voltage') || i.type.includes('current')) ? 80 : 100,
          overall: analysis.healthScore,
        },
        trend: 'stable',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;
