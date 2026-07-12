const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

router.post('/', authenticate, authorize('Fleet Manager'), async (req, res) => {
  try {
    const { registrationNumber, make, model, capacityWeight, acquisitionCost, status } = req.body;
    const vehicleStatus = status || 'Available';
    const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
    if (!validStatuses.includes(vehicleStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const vehicle = await prisma.vehicle.create({ 
      data: { registrationNumber, make, model, capacityWeight, acquisitionCost, status: vehicleStatus }
    });
    res.status(201).json(vehicle);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('registrationNumber')) {
      return res.status(400).json({ error: 'Registration number must be unique' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    res.json(await prisma.vehicle.findMany());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Fleet Manager'), async (req, res) => {
  try {
    const { registrationNumber, make, model, capacityWeight, acquisitionCost, status } = req.body;
    const updateData = {};
    
    if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber;
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (capacityWeight !== undefined) updateData.capacityWeight = parseFloat(capacityWeight);
    if (acquisitionCost !== undefined) updateData.acquisitionCost = parseFloat(acquisitionCost);
    
    if (status !== undefined) {
      const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Fleet Manager'), async (req, res) => {
  try {
    const vehicleId = parseInt(req.params.id);
    
    // Delete related records manually to avoid foreign key constraints since we don't have cascade delete
    await prisma.$transaction([
      prisma.trip.deleteMany({ where: { vehicleId } }),
      prisma.maintenanceLog.deleteMany({ where: { vehicleId } }),
      prisma.fuelLog.deleteMany({ where: { vehicleId } }),
      prisma.expense.deleteMany({ where: { vehicleId } }),
      prisma.vehicle.delete({ where: { id: vehicleId } })
    ]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
