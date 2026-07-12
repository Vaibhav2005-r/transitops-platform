const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Mount Routes
const m3Routes = require('./routes/m3.routes');
const driversRouter = require('./routes/drivers');
const reportsRouter = require('./routes/reports.routes');
const tripsRouter = require('./routes/trips');
const aiRouter = require('./routes/ai.routes');
const dashboardRoutes = require('./routes/dashboard');
const maintenanceRoutes = require('./routes/maintenance');
const fuelRoutes = require('./routes/fuel');
const expensesRoutes = require('./routes/expenses');

app.use('/api', m3Routes);
app.use('/api', dashboardRoutes);
app.use('/api/drivers', driversRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/expenses', expensesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`TransitOps server running on port ${PORT}`);
});
