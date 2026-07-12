const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function seed() {
  console.log('Seeding 400 records for each table...');

  // 1. Vehicles (400)
  const vehicleData = Array.from({ length: 400 }).map((_, i) => ({
    registrationNumber: `MH-${Math.floor(10 + Math.random() * 90)}-XY-${1000 + i}-${crypto.randomBytes(2).toString('hex')}`,
    make: ['Ford', 'Toyota', 'Volvo', 'Mercedes', 'Tesla', 'Rivian'][Math.floor(Math.random() * 6)],
    model: ['Transit', 'Camry', 'FH16', 'Sprinter', 'Semi', 'EDV'][Math.floor(Math.random() * 6)],
    capacityWeight: Math.floor(1000 + Math.random() * 9000),
    acquisitionCost: Math.floor(20000 + Math.random() * 80000),
    status: ['Available', 'On Trip', 'In Shop', 'Retired'][Math.floor(Math.random() * 4)]
  }));
  await prisma.$transaction(
    vehicleData.map(data => prisma.vehicle.upsert({
      where: { registrationNumber: data.registrationNumber },
      update: {},
      create: data
    }))
  );
  console.log('✅ 400 Vehicles seeded');

  const allVehicles = await prisma.vehicle.findMany({ select: { id: true } });

  // 2. Drivers (400)
  const driverData = Array.from({ length: 400 }).map((_, i) => ({
    name: `Driver ${crypto.randomBytes(3).toString('hex')}`,
    licenseNumber: `DL-${Math.floor(100000 + Math.random() * 900000)}-${i}`,
    licenseExpiryDate: new Date(Date.now() + Math.random() * 100000000000),
    safetyScore: Math.floor(60 + Math.random() * 40),
    status: ['Available', 'On Trip', 'Off Duty'][Math.floor(Math.random() * 3)]
  }));
  await prisma.$transaction(
    driverData.map(data => prisma.driver.upsert({
      where: { licenseNumber: data.licenseNumber },
      update: {},
      create: data
    }))
  );
  console.log('✅ 400 Drivers seeded');

  const allDrivers = await prisma.driver.findMany({ select: { id: true } });

  // 3. FuelLogs (400)
  const fuelData = Array.from({ length: 400 }).map(() => ({
    vehicleId: allVehicles[Math.floor(Math.random() * allVehicles.length)].id,
    liters: 10 + Math.random() * 90,
    cost: 50 + Math.random() * 450,
    // Scatter dates across the last 7 days so it shows up on the dashboard chart
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
  await prisma.$transaction(
    fuelData.map(data => prisma.fuelLog.create({ data }))
  );
  console.log('✅ 400 Fuel Logs seeded');

  // 4. MaintenanceLogs (400)
  const mainData = Array.from({ length: 400 }).map(() => ({
    vehicleId: allVehicles[Math.floor(Math.random() * allVehicles.length)].id,
    description: ['Oil Change', 'Tire Replacement', 'Brake Pad Replacement', 'Engine Tune-up', 'Filter Check'][Math.floor(Math.random() * 5)],
    cost: 100 + Math.random() * 900,
    // Scatter dates across the last 7 days so it shows up on the dashboard chart
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
  await prisma.$transaction(
    mainData.map(data => prisma.maintenanceLog.create({ data }))
  );
  console.log('✅ 400 Maintenance Logs seeded');

  // 5. Expenses (400)
  const expenseData = Array.from({ length: 400 }).map(() => ({
    vehicleId: allVehicles[Math.floor(Math.random() * allVehicles.length)].id,
    description: 'Operational Expense',
    cost: 20 + Math.random() * 200,
    type: ['Toll', 'Parking', 'Cleaning', 'Permit'][Math.floor(Math.random() * 4)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  }));
  await prisma.$transaction(
    expenseData.map(data => prisma.expense.create({ data }))
  );
  console.log('✅ 400 Expenses seeded');

  // 6. Trips (400) - even though there are 10k already, let's add 400 more recent ones
  const tripData = Array.from({ length: 400 }).map(() => ({
    vehicleId: allVehicles[Math.floor(Math.random() * allVehicles.length)].id,
    driverId: allDrivers[Math.floor(Math.random() * allDrivers.length)].id,
    source: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    destination: ['Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'][Math.floor(Math.random() * 5)],
    cargoWeight: Math.floor(500 + Math.random() * 3000),
    distance: Math.floor(50 + Math.random() * 800),
    revenue: Math.floor(500 + Math.random() * 5000),
    status: ['Draft', 'Dispatched', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));
  await prisma.$transaction(
    tripData.map(data => prisma.trip.create({ data }))
  );
  console.log('✅ 400 Trips seeded');

  // 7. Users (400)
  const userData = Array.from({ length: 400 }).map((_, i) => ({
    email: `user_${i}_${crypto.randomBytes(3).toString('hex')}@transitops.com`,
    passwordHash: 'hashed_password_mock',
    name: `User ${i}`,
    role: ['Fleet Manager', 'Admin', 'Viewer'][Math.floor(Math.random() * 3)]
  }));
  await prisma.$transaction(
    userData.map(data => prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: data
    }))
  );
  console.log('✅ 400 Users seeded');

  console.log('🎉 Database seeding complete!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
