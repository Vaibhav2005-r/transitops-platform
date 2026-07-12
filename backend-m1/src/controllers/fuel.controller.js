const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { createFuelSchema } = require('../validators/m3.validators');

exports.createFuelLog = async (req, res) => {
  try {
    const parseResult = createFuelSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.issues.map(e => e.message).join(', ') });
    }

    const { vehicleId, liters, cost, date } = parseResult.data;

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
