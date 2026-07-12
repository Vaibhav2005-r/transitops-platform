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

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      underMaintenance,
      totalDrivers,
      topDrivers,
      allFuelLogs,
      allMaintenanceLogs,
      allTrips
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: { in: ['Available', 'On Trip'] } } }),
      prisma.vehicle.count({ where: { status: 'In Shop' } }),
      prisma.driver.count(),
      prisma.driver.findMany({
        orderBy: { safetyScore: 'desc' },
        take: 5,
        select: { id: true, name: true, safetyScore: true }
      }),
      prisma.fuelLog.aggregate({ _sum: { liters: true } }),
      prisma.maintenanceLog.findMany({
        where: { date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
        select: { date: true, cost: true }
      }),
      prisma.trip.aggregate({ _sum: { distance: true } })
    ]);

    const totalDistance = allTrips._sum.distance || 0;
    const totalLiters = allFuelLogs._sum.liters || 0;
    const avgFuelEfficiency = totalLiters > 0 ? Number((totalDistance / totalLiters).toFixed(2)) : 0;

    // Mock Fleet Status by Category (Since we lack Fuel Type in schema)
    const fleetStatusByCategory = [
      { name: 'Diesel', value: Math.floor(totalVehicles * 0.49), fill: '#0ea5e9' },
      { name: 'Petrol', value: Math.floor(totalVehicles * 0.27), fill: '#0284c7' },
      { name: 'Electric', value: Math.ceil(totalVehicles * 0.24), fill: '#38bdf8' }
    ];

    // Mock Fuel vs Maintenance for last 6 days
    const fuelVsMaintenance = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (5 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Maintenance: Math.floor(Math.random() * 60000) + 30000, // Mock 30k-90k
        Fuel: Math.floor(Math.random() * 50000) + 20000         // Mock 20k-70k
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        activeVehicles,
        underMaintenance,
        totalDrivers,
        avgFuelEfficiency,
        topDrivers,
        fleetStatusByCategory,
        fuelVsMaintenance
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
