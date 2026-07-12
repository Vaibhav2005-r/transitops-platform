const express = require('express');
const prisma = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// List Expenses
router.get('/', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    const rawExpenses = await prisma.expense.findMany();
    const rawFuelLogs = await prisma.fuelLog.findMany();

    const formattedFuelLogs = rawFuelLogs.map(log => ({
      id: `f-${log.id}`,
      vehicleId: log.vehicleId,
      description: `${log.liters} Liters`,
      cost: log.cost,
      type: 'Fuel',
      date: log.date
    }));

    const combined = [...rawExpenses, ...formattedFuelLogs];

    combined.sort((a, b) => {
      // Sort by date (descending)
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      // Sort by amount/cost (descending)
      return b.cost - a.cost;
    });

    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record Other Expense
router.post('/', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    const { vehicleId, description, cost, type } = req.body;

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        description,
        cost,
        type
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Expense
router.put('/:id', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    const { description, cost, type } = req.body;

    const expense = await prisma.expense.update({
      where: { id: parseInt(req.params.id) },
      data: {
        description,
        cost,
        type
      }
    });

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Expense
router.delete('/:id', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    await prisma.expense.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
