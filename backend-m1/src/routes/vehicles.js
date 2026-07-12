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
    const { status } = req.body;
    const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Fleet Manager'), async (req, res) => {
  try {
    await prisma.vehicle.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
