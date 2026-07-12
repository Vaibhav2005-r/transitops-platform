const express = require('express');
const prisma = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// List Expenses
router.get('/', authenticate, authorize('Fleet Manager', 'Financial Analyst'), async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
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
