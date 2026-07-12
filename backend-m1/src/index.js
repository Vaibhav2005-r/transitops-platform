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
app.use('/api', m3Routes);

// Start server
app.listen(PORT, () => {
  console.log(`TransitOps server running on port ${PORT}`);
});
