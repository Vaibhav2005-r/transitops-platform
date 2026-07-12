const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getVehicleAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleId = parseInt(id);

    // 1. Validate vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // 2. Fetch all required aggregates in parallel using Promise.all
    const [
      maintenanceLogs,
      fuelLogs,
      expenses,
      trips
    ] = await Promise.all([
      prisma.maintenanceLog.aggregate({
        where: { vehicleId },
        _sum: { cost: true }
      }),
      prisma.fuelLog.aggregate({
        where: { vehicleId },
        _sum: { cost: true, liters: true }
      }),
      prisma.expense.aggregate({
        where: { vehicleId },
        _sum: { cost: true }
      }),
      prisma.trip.aggregate({
        where: { vehicleId, status: 'Completed' },
        _sum: { distance: true, revenue: true }
      })
    ]);

    // 3. Extract summed values (default to 0 if null)
    const totalMaintenanceCost = maintenanceLogs._sum.cost || 0;
    const totalFuelCost = fuelLogs._sum.cost || 0;
    const totalFuelLiters = fuelLogs._sum.liters || 0;
    const totalExpenseCost = expenses._sum.cost || 0;
    
    const totalDistance = trips._sum.distance || 0;
    const totalRevenue = trips._sum.revenue || 0;

    // 4. Calculate Formulas
    // Operational Cost = Maintenance + Fuel + Expenses
    const operationalCost = totalMaintenanceCost + totalFuelCost + totalExpenseCost;

    // Fuel Efficiency = Total Distance / Total Liters
    const fuelEfficiency = totalFuelLiters > 0 
      ? Number((totalDistance / totalFuelLiters).toFixed(2)) 
      : 0;

    // ROI = ((Revenue - Operational Cost) / Acquisition Cost) * 100
    let roi = 0;
    if (vehicle.acquisitionCost && vehicle.acquisitionCost > 0) {
      roi = Number((((totalRevenue - operationalCost) / vehicle.acquisitionCost) * 100).toFixed(2));
    }

    // 5. Return the exact structure from the API Contract
    res.status(200).json({
      fuelEfficiency,
      operationalCost,
      roi
    });

  } catch (error) {
    console.error('Error generating vehicle analytics:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
