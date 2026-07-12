const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createMaintenanceLog = async (req, res) => {
  try {
    const { vehicleId, description, cost, date } = req.body;

    if (!vehicleId || !description || cost === undefined) {
      return res.status(400).json({ success: false, error: 'vehicleId, description, and cost are required' });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        vehicleId: parseInt(vehicleId),
        description,
        cost: parseFloat(cost),
        date: date ? new Date(date) : undefined,
      },
    });

    res.status(201).json({
      success: true,
      data: maintenanceLog,
    });
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
