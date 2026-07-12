const express = require('express');
const prisma = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Record Fuel Log
router.post('/', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    const { vehicleId, liters, cost } = req.body;

    const log = await prisma.fuelLog.create({
      data: {
        vehicleId,
        liters,
        cost
      }
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
