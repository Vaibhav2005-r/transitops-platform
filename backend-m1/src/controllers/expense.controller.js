const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  try {
    const { vehicleId, description, cost, type, date } = req.body;

    if (!vehicleId || !description || cost === undefined || !type) {
      return res.status(400).json({ success: false, error: 'vehicleId, description, cost, and type are required' });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId: parseInt(vehicleId),
        description,
        cost: parseFloat(cost),
        type,
        date: date ? new Date(date) : undefined,
      },
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
