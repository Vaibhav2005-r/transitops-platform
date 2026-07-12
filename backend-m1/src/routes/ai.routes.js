const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/ai/copilot
router.post('/copilot', aiController.copilotQuery);

module.exports = router;
