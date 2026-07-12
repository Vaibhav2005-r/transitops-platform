const express = require('express');
const prisma = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Create Maintenance Log and set vehicle to In Shop
router.post('/', authenticate, authorize('Fleet Manager', 'Safety Officer'), async (req, res) => {
  try {
    const { vehicleId, description, cost } = req.body;

    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (prisma) => {
      const log = await prisma.maintenanceLog.create({
        data: {
          vehicleId,
          description,
          cost
        }
      });

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'In Shop' }
      });

      return log;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close Maintenance Log (Auto-Available)
router.put('/:id/close', authenticate, authorize('Fleet Manager', 'Safety Officer'), async (req, res) => {
  try {
    const logId = parseInt(req.params.id);

    const result = await prisma.$transaction(async (prisma) => {
      const log = await prisma.maintenanceLog.findUnique({
        where: { id: logId }
      });

      if (!log) {
        throw new Error('Maintenance log not found');
      }

      const vehicle = await prisma.vehicle.findUnique({
        where: { id: log.vehicleId }
      });

      if (vehicle.status !== 'Retired') {
        await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: { status: 'Available' }
        });
      }

      return log;
    });

    res.json(result);
  } catch (error) {
    if (error.message === 'Maintenance log not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
