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
    const filter = req.query.filter || '7'; // '7', '30', or 'month'
    let daysCount = 7;
    let startDate = new Date();
    
    if (filter === '30') {
      daysCount = 30;
      startDate.setDate(startDate.getDate() - 30);
    } else if (filter === 'month') {
      const today = new Date();
      daysCount = today.getDate();
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    const [
      totalVehicles,
      activeVehicles,
      underMaintenance,
      totalDrivers,
      liveVehicles,
      topDrivers,
      allFuelLogs,
      allMaintenanceLogs,
      allTrips,
      totalTrips
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: { in: ['Available', 'On Trip'] } } }),
      prisma.vehicle.count({ where: { status: 'In Shop' } }),
      prisma.driver.count(),
      prisma.vehicle.findMany({
        where: { status: { not: 'Retired' } },
        select: { id: true, registrationNumber: true, status: true, make: true, model: true }
      }),
      prisma.driver.findMany({
        orderBy: { safetyScore: 'desc' },
        take: 5,
        select: { id: true, name: true, safetyScore: true }
      }),
      prisma.fuelLog.aggregate({ where: { date: { gte: startDate } }, _sum: { liters: true } }),
      prisma.maintenanceLog.findMany({
        where: { date: { gte: startDate } },
        select: { date: true, cost: true }
      }),
      prisma.trip.aggregate({ where: { createdAt: { gte: startDate } }, _sum: { distance: true } }),
      prisma.trip.count({ where: { createdAt: { gte: startDate } } })
    ]);

    const totalDistance = allTrips._sum.distance || 0;
    const totalLiters = allFuelLogs._sum.liters || 0;
    const avgFuelEfficiency = totalLiters > 0 ? Number((totalDistance / totalLiters).toFixed(2)) : 0;

    // Real Fleet Status by Category (Grouping by Status)
    const statusGroups = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: { id: true }
    });
    
    const colorMap = {
      'Available': '#10b981', // Emerald
      'On Trip': '#3b82f6',   // Blue
      'In Shop': '#f43f5e',   // Rose
      'Retired': '#64748b'    // Slate
    };

    const fleetStatusByCategory = statusGroups.map(group => ({
      name: group.status,
      value: group._count.id,
      fill: colorMap[group.status] || '#cbd5e1'
    }));

    // Dynamic Fuel vs Maintenance for requested timeframe
    const dateRange = Array.from({ length: daysCount }).map((_, i) => {
      const d = new Date();
      if (filter === 'month') {
         d.setDate(i + 1); // 1st to today
      } else {
         d.setDate(d.getDate() - (daysCount - 1 - i));
      }
      return {
        date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        Maintenance: 0,
        Fuel: 0
      };
    });

    // Aggregate Maintenance
    allMaintenanceLogs.forEach(log => {
      const dateStr = log.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const day = dateRange.find(d => d.date === dateStr);
      if (day) day.Maintenance += log.cost;
    });

    // Aggregate Fuel
    const recentFuelLogs = await prisma.fuelLog.findMany({
      where: { date: { gte: startDate } },
      select: { date: true, cost: true }
    });
    
    recentFuelLogs.forEach(log => {
      const dateStr = log.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const day = dateRange.find(d => d.date === dateStr);
      if (day) day.Fuel += log.cost;
    });

    // Define central points for all requested states
    const stateCenters = [
      { lat: 22.2587, lng: 71.1924 }, // Gujarat (GJ)
      { lat: 19.7515, lng: 75.7139 }, // Maharashtra (MH)
      { lat: 27.0238, lng: 74.2179 }, // Rajasthan (RJ)
      { lat: 26.8467, lng: 80.9462 }, // Uttar Pradesh (UP)
      { lat: 22.9734, lng: 78.6569 }, // Madhya Pradesh (MP)
      { lat: 31.1471, lng: 75.3412 }, // Punjab
      { lat: 29.0588, lng: 76.0856 }, // Haryana (HR)
      { lat: 28.7041, lng: 77.1025 }, // Delhi
      { lat: 31.1048, lng: 77.1734 }, // Himachal Pradesh (HP)
      { lat: 25.0961, lng: 85.3131 }, // Bihar
      { lat: 22.9868, lng: 87.8550 }, // West Bengal (WB)
      { lat: 15.3173, lng: 75.7139 }, // Karnataka
      { lat: 11.1271, lng: 78.6569 }, // Tamil Nadu (TN)
      { lat: 18.1124, lng: 79.0193 }, // Telangana (TG)
      { lat: 15.9129, lng: 79.7400 }, // Andhra Pradesh (AP)
      { lat: 23.6102, lng: 85.2799 }, // Jharkhand (ZH)
      { lat: 26.2006, lng: 92.9376 }  // NE India (Assam)
    ];

    const vehiclesWithLocation = liveVehicles.map((v, index) => {
      // Pick a state deterministically based on ID to ensure consistent packets
      const center = stateCenters[index % stateCenters.length];
      
      // Use polar coordinates to create an organic circular/cloud scatter instead of a square bounding box
      // Radius up to ~1.2 degrees (approx 130km) from the state center
      // Using Math.sqrt(Math.random()) ensures uniform distribution inside the circle
      const radius = Math.sqrt(Math.random()) * 1.2; 
      const angle = Math.random() * 2 * Math.PI;
      
      const safeLat = center.lat + (radius * Math.cos(angle));
      const safeLng = center.lng + (radius * Math.sin(angle));
      
      return {
        ...v,
        lat: safeLat,
        lng: safeLng
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
        fuelVsMaintenance: dateRange,
        totalTrips,
        liveVehicles: vehiclesWithLocation
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// 8.1 Dashboard KPIs
exports.getDashboardKPIs = async (req, res) => {
  try {
    const [
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      totalActiveFleet,
      activeTrips,
      pendingTrips,
      driversOnDuty
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: 'On Trip' } }),
      prisma.vehicle.count({ where: { status: 'Available' } }),
      prisma.vehicle.count({ where: { status: 'In Shop' } }),
      prisma.vehicle.count({ where: { status: { not: 'Retired' } } }),
      
      prisma.trip.count({ where: { status: 'Dispatched' } }),
      prisma.trip.count({ where: { status: 'Draft' } }),
      
      prisma.driver.count({ where: { status: { in: ['Available', 'On Trip'] } } })
    ]);

    // Formula: (Available + On Trip) / Total Active Fleet * 100
    // Note: totalActiveFleet excludes Retired vehicles
    let fleetUtilization = 0;
    if (totalActiveFleet > 0) {
      fleetUtilization = Number((((availableVehicles + activeVehicles) / totalActiveFleet) * 100).toFixed(1));
    }

    res.status(200).json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    });

  } catch (error) {
    console.error('Error generating dashboard KPIs:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
