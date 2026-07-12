const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analytics.controller');

// M3: Analytics Endpoints (Hour 5 implementation done early)
router.get('/vehicle/:id/analytics', analyticsController.getVehicleAnalytics);

module.exports = router;
