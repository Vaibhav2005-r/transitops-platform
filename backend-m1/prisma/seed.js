const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 10,000 dummy records...');

  // 1. Create a few dummy Vehicles
  const vehiclesData = Array.from({ length: 10 }).map((_, i) => ({
    registrationNumber: `VAN-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
    make: 'Ford',
    model: 'Transit',
    capacityWeight: 1500.0,
    acquisitionCost: 35000.0,
    status: 'Available',
  }));

  await prisma.vehicle.createMany({
    data: vehiclesData,
  });

  // 2. Create a few dummy Drivers
  const driversData = Array.from({ length: 10 }).map((_, i) => ({
    name: `Driver ${i}`,
    licenseNumber: `DL-${Math.floor(100000000 + Math.random() * 900000000)}-${i}`,
    licenseExpiryDate: new Date('2028-12-31T00:00:00.000Z'),
    safetyScore: Math.floor(80 + Math.random() * 20),
    status: 'Available',
  }));

  await prisma.driver.createMany({
    data: driversData,
  });

  // Get the IDs of the newly created vehicles and drivers
  const vehicles = await prisma.vehicle.findMany({ take: 10 });
  const drivers = await prisma.driver.findMany({ take: 10 });

  if (vehicles.length === 0 || drivers.length === 0) {
      console.log('Ensure database is clean before seeding or there are vehicles/drivers.');
  }

  // 3. Create 10,000 dummy Trips
  const BATCH_SIZE = 5000;
  const TOTAL_RECORDS = 10000;
  
  for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
    const tripsData = Array.from({ length: BATCH_SIZE }).map((_, idx) => {
      const v = vehicles[Math.floor(Math.random() * vehicles.length)];
      const d = drivers[Math.floor(Math.random() * drivers.length)];
      return {
        vehicleId: v.id,
        driverId: d.id,
        source: `Warehouse ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        destination: `Retailer ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        cargoWeight: Math.floor(100 + Math.random() * 1000),
        distance: Math.floor(10 + Math.random() * 300),
        status: ['Draft', 'Dispatched', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
        revenue: Math.floor(Math.random() * 500),
      };
    });

    await prisma.trip.createMany({
      data: tripsData,
    });
    
    console.log(`Seeded batch of ${BATCH_SIZE} trips...`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
