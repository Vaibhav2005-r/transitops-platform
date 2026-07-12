const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 7.2 List Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// 7.3 Record Other Expense
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

    res.status(201).json(expense); // API Contract specifies returning just the object
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// 7.4 Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, cost, type } = req.body;

    const existingExpense = await prisma.expense.findUnique({ where: { id: parseInt(id) } });
    if (!existingExpense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        description: description || undefined,
        cost: cost !== undefined ? parseFloat(cost) : undefined,
        type: type || undefined
      }
    });

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// 7.5 Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existingExpense = await prisma.expense.findUnique({ where: { id: parseInt(id) } });
    if (!existingExpense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
