const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createFuelLog = async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;

    if (!vehicleId || liters === undefined || cost === undefined) {
      return res.status(400).json({ success: false, error: 'vehicleId, liters, and cost are required' });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId: parseInt(vehicleId),
        liters: parseFloat(liters),
        cost: parseFloat(cost),
        date: date ? new Date(date) : undefined,
      },
    });

    res.status(201).json({
      success: true,
      data: fuelLog,
    });
  } catch (error) {
    console.error('Error creating fuel log:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
