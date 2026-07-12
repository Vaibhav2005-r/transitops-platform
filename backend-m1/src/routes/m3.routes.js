const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const maintenanceController = require('../controllers/maintenance.controller');
const fuelController = require('../controllers/fuel.controller');
const expenseController = require('../controllers/expense.controller');

// M3: Basic Create Endpoints (Hour 2)
router.post('/maintenance', authenticate, authorize('Fleet Manager'), maintenanceController.createMaintenanceLog);
router.post('/fuel', authenticate, authorize('Fleet Manager', 'Driver'), fuelController.createFuelLog);

// M3: Expense CRUD Endpoints (Hour 2)
router.get('/expenses', authenticate, authorize('Fleet Manager', 'Financial Analyst'), expenseController.getExpenses);
router.post('/expenses', authenticate, authorize('Fleet Manager', 'Financial Analyst'), expenseController.createExpense);
router.put('/expenses/:id', authenticate, authorize('Fleet Manager', 'Financial Analyst'), expenseController.updateExpense);
router.delete('/expenses/:id', authenticate, authorize('Fleet Manager', 'Financial Analyst'), expenseController.deleteExpense);

// M3: Business Logic Endpoints (Hour 3)
router.put('/maintenance/:id/close', authenticate, authorize('Fleet Manager'), maintenanceController.closeMaintenanceLog);

module.exports = router;
