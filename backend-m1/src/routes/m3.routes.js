const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenance.controller');
const fuelController = require('../controllers/fuel.controller');
const expenseController = require('../controllers/expense.controller');

// M3: Basic Create Endpoints (Hour 2)
router.post('/maintenance', maintenanceController.createMaintenanceLog);
router.post('/fuel', fuelController.createFuelLog);

// M3: Expense CRUD Endpoints (Hour 2)
router.get('/expenses', expenseController.getExpenses);
router.post('/expenses', expenseController.createExpense);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

// M3: Business Logic Endpoints (Hour 3)
router.put('/maintenance/:id/close', maintenanceController.closeMaintenanceLog);

module.exports = router;
