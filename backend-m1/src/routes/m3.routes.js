const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenance.controller');
const fuelController = require('../controllers/fuel.controller');
const expenseController = require('../controllers/expense.controller');

// M3: Basic Create Endpoints (Hour 2)
router.post('/maintenance', maintenanceController.createMaintenanceLog);
router.post('/fuel', fuelController.createFuelLog);
router.post('/expense', expenseController.createExpense);

module.exports = router;
