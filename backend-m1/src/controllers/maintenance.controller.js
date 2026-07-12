const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { createMaintenanceSchema } = require('../validators/m3.validators');

exports.createMaintenanceLog = async (req, res) => {
  try {
    const parseResult = createMaintenanceSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, error: parseResult.error.issues.map(e => e.message).join(', ') });
    }

    const { vehicleId, description, cost, date } = parseResult.data;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Wrap in a transaction to ensure both operations succeed or fail together
    const [maintenanceLog, updatedVehicle] = await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: {
          vehicleId: parseInt(vehicleId),
          description,
          cost: parseFloat(cost),
          date: date ? new Date(date) : undefined,
        },
      }),
      prisma.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: { status: 'In Shop' }
      })
    ]);

    res.status(201).json({
      success: true,
      data: maintenanceLog,
      vehicleStatus: updatedVehicle.status
    });
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.closeMaintenanceLog = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenanceLog = await prisma.maintenanceLog.findUnique({
      where: { id: parseInt(id) },
      include: { vehicle: true }
    });

    if (!maintenanceLog) {
      return res.status(404).json({ success: false, error: 'Maintenance log not found' });
    }

    // Only restore status to Available if the vehicle is not Retired
    let updatedStatus = maintenanceLog.vehicle.status;
    if (maintenanceLog.vehicle.status !== 'Retired') {
      await prisma.vehicle.update({
        where: { id: maintenanceLog.vehicleId },
        data: { status: 'Available' }
      });
      updatedStatus = 'Available';
    }

    res.status(200).json({
      success: true,
      data: maintenanceLog,
      vehicleStatus: updatedStatus
    });
  } catch (error) {
    console.error('Error closing maintenance log:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
