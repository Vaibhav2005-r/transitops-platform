const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const { authenticate, authorize } = require('../middleware/auth');

// 1. Create Trip (Draft) (POST /api/trips)
router.post('/', authenticate, authorize('Fleet Manager', 'Dispatcher'), async (req, res) => {
  try {
    const { vehicleId, driverId, source, destination, cargoWeight, distance } = req.body;

    if (!vehicleId || !driverId || !source || !destination || cargoWeight === undefined || distance === undefined) {
      return res.status(400).json({ error: 'vehicleId, driverId, source, destination, cargoWeight, distance are required.' });
    }

    // Check Vehicle
    const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId, 10) } });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
    // Rule 1: Vehicle must not be Retired or In Shop
    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return res.status(400).json({ error: `Validation failed: Vehicle is ${vehicle.status}.` });
    }
    // Rule 3: Cargo weight must not exceed vehicle's capacity weight
    if (parseFloat(cargoWeight) > vehicle.capacityWeight) {
      return res.status(400).json({ error: `Validation failed: Cargo weight exceeds vehicle capacity of ${vehicle.capacityWeight} kg.` });
    }

    // Check Driver
    const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId, 10) } });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found.' });
    }
    // Rule 2: Driver must not have an expired license or be Suspended
    const currentDate = new Date('2026-07-12T00:00:00.000Z'); // Current local date as per API_CONTRACT
    if (new Date(driver.licenseExpiryDate) < currentDate) {
      return res.status(400).json({ error: 'Validation failed: Driver license is expired.' });
    }
    if (driver.status === 'Suspended') {
      return res.status(400).json({ error: 'Validation failed: Driver is Suspended.' });
    }

    // Create Draft Trip
    const trip = await prisma.trip.create({
      data: {
        vehicleId: parseInt(vehicleId, 10),
        driverId: parseInt(driverId, 10),
        source,
        destination,
        cargoWeight: parseFloat(cargoWeight),
        distance: parseFloat(distance),
        status: 'Draft',
        revenue: 0.0
      }
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Transition Trip: Update Status (PUT /api/trips/:id/status)
router.put('/:id/status', authenticate, authorize('Fleet Manager', 'Dispatcher'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Dispatched', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status transition.' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id, 10) },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    const updateData = { status };

    if (trip.status === 'Draft' && status === 'Dispatched') {
      // Draft -> Dispatched
      if (trip.vehicle.status !== 'Available' || trip.driver.status !== 'Available') {
         return res.status(400).json({ error: 'Validation failed: Vehicle and Driver must be Available to dispatch.' });
      }

      // Update Trip, Vehicle, and Driver in a transaction
      const [updatedTrip, updatedVehicle, updatedDriver] = await prisma.$transaction([
        prisma.trip.update({ where: { id: trip.id }, data: updateData }),
        prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'On Trip' } }),
        prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'On Trip' } })
      ]);

      return res.json(updatedTrip);
    } else if (trip.status === 'Dispatched' && (status === 'Completed' || status === 'Cancelled')) {
      // Dispatched -> Completed/Cancelled
      const [updatedTrip, updatedVehicle, updatedDriver] = await prisma.$transaction([
        prisma.trip.update({ where: { id: trip.id }, data: updateData }),
        prisma.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'Available' } }),
        prisma.driver.update({ where: { id: trip.driverId }, data: { status: 'Available' } })
      ]);

      return res.json(updatedTrip);
    } else {
      return res.status(400).json({ error: `Invalid transition from ${trip.status} to ${status}.` });
    }
  } catch (error) {
    console.error('Error transitioning trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. List Trips (GET /api/trips)
router.get('/', async (req, res) => {
  try {
    const { status, vehicleId, driverId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (vehicleId) where.vehicleId = parseInt(vehicleId, 10);
    if (driverId) where.driverId = parseInt(driverId, 10);

    const trips = await prisma.trip.findMany({
      where,
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: 'desc' },
      take: 100 // Add a limit since there are 10,000 dummy records!
    });

    res.json(trips);
  } catch (error) {
    console.error('Error listing trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Get Trip Details (GET /api/trips/:id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id, 10) },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Update Trip (PUT /api/trips/:id)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source, destination, cargoWeight, distance, revenue } = req.body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const updateData = {};
    if (source !== undefined) updateData.source = source;
    if (destination !== undefined) updateData.destination = destination;
    if (cargoWeight !== undefined) updateData.cargoWeight = parseFloat(cargoWeight);
    if (distance !== undefined) updateData.distance = parseFloat(distance);
    if (revenue !== undefined) updateData.revenue = parseFloat(revenue);

    const trip = await prisma.trip.update({
      where: { id: parseInt(id, 10) },
      data: updateData
    });

    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Delete Trip (DELETE /api/trips/:id)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTrip = await prisma.trip.findUnique({
      where: { id: parseInt(id, 10) }
    });

    if (!existingTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await prisma.trip.delete({
      where: { id: parseInt(id, 10) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
