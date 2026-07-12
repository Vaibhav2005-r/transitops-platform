const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

router.post('/', authenticate, authorize('Fleet Manager'), async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (error) {
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

module.exports = router;
