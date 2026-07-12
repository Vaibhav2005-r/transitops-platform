const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Hour 5 (1-2 PM) - Dashboard KPI Endpoints
router.get('/dashboard/kpis', authenticate, async (req, res) => {
  try {
    const { type, status, region } = req.query;
    
    // Note: The prompt included `type` and `region` which are not in the current Prisma schema for Vehicle.
    // However, we will include them in `where` exactly as requested.
    // If Prisma throws an error due to unknown fields, the user's instructions imply they might want it exactly as written,
    // but to be safe and ensure the code doesn't crash on standard M1 schemas, we will only map fields that exist or 
    // we can ignore the Prisma error or just use the exact code provided.
    // The exact code provided by user:
    const where = {
      ...(type && { type }),
      ...(status && { status }),
      ...(region && { region }),
    };

    const [total, available, inShop, onTrip] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.count({ where: { ...where, status: 'Available' } }),
      prisma.vehicle.count({ where: { ...where, status: 'In Shop' } }),
      prisma.vehicle.count({ where: { ...where, status: 'On Trip' } }),
    ]);
    const activeTrips = await prisma.trip.count({ where: { status: 'Dispatched' } });
    const pendingTrips = await prisma.trip.count({ where: { status: 'Draft' } });
    const driversOnDuty = await prisma.driver.count({ where: { status: 'On Trip' } });
    const utilization = total ? Math.round((onTrip / total) * 100) : 0;

    res.json({ total, available, inShop, onTrip, activeTrips, pendingTrips, driversOnDuty, utilization });
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

module.exports = router;
