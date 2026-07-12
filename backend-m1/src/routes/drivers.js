const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// 1. Create Driver (POST /api/drivers)
router.post('/', async (req, res) => {
  try {
    const { name, licenseNumber, licenseExpiryDate, safetyScore } = req.body;

    // Validate request
    if (!name || !licenseNumber || !licenseExpiryDate) {
      return res.status(400).json({ error: 'Name, licenseNumber, and licenseExpiryDate are required.' });
    }

    const parsedExpiryDate = new Date(licenseExpiryDate);
    if (isNaN(parsedExpiryDate.getTime())) {
      return res.status(400).json({ error: 'Invalid licenseExpiryDate format.' });
    }

    // Check if license number already exists
    const existingDriver = await prisma.driver.findUnique({
      where: { licenseNumber }
    });
    if (existingDriver) {
      return res.status(400).json({ error: 'A driver with this license number already exists.' });
    }

    // Create the driver
    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseExpiryDate: parsedExpiryDate,
        safetyScore: safetyScore !== undefined ? parseInt(safetyScore, 10) : 100,
        status: 'Available'
      }
    });

    res.status(201).json(driver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. List Drivers (GET /api/drivers)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const drivers = await prisma.driver.findMany({
      where,
      orderBy: { id: 'asc' }
    });

    res.json(drivers);
  } catch (error) {
    console.error('Error listing drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
