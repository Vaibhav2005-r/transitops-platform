const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy fuel and maintenance logs for the past 30 days...');
  
  const vehicles = await prisma.vehicle.findMany({ take: 10 });
  if (vehicles.length === 0) return;

  const fuelData = [];
  const maintenanceData = [];

  // Generate logs over the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add 2-5 fuel logs per day
    const numFuels = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < numFuels; j++) {
      fuelData.push({
        vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id,
        liters: Math.floor(20 + Math.random() * 50),
        cost: Math.floor((20 + Math.random() * 50) * 100), // INR cost
        date: date
      });
    }

    // Add 0-2 maintenance logs per day
    const numMaintenance = Math.floor(Math.random() * 3);
    for (let j = 0; j < numMaintenance; j++) {
      maintenanceData.push({
        vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)].id,
        description: ['Oil Change', 'Brake Inspection', 'Tire Replacement', 'Engine Tune-up'][Math.floor(Math.random() * 4)],
        cost: Math.floor((100 + Math.random() * 500) * 83), // INR cost
        date: date
      });
    }
  }

  await prisma.fuelLog.createMany({ data: fuelData });
  await prisma.maintenanceLog.createMany({ data: maintenanceData });

  // Update trips to spread over the last 30 days so "Total Trips" changes based on filter
  const allTrips = await prisma.trip.findMany({ take: 2000 });
  for (let i = 0; i < allTrips.length; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 35); // Spread over 35 days
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - randomDaysAgo);
    
    await prisma.trip.update({
      where: { id: allTrips[i].id },
      data: { createdAt: randomDate }
    });
  }

  console.log('Seeding logs and spreading trip dates complete!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
