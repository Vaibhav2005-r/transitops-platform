const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const analyticsController = require('../controllers/analytics.controller');

// M1/M4: Dashboard Aggregation — all authenticated roles can view
router.get('/dashboard', authenticate, analyticsController.getDashboardStats);

// M3: Dashboard KPIs (Hour 4)
router.get('/kpis', authenticate, authorize('Fleet Manager', 'Financial Analyst'), analyticsController.getDashboardKPIs);

// M3: Analytics Endpoints (Hour 5 implementation done early)
router.get('/vehicle/:id/analytics', authenticate, authorize('Fleet Manager', 'Financial Analyst'), analyticsController.getVehicleAnalytics);

module.exports = router;
