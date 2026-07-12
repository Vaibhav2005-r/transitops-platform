const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Converting USD values to INR (multiplier = 83)...');
  const multiplier = 83;

  // 1. Vehicle acquisition cost
  const vehicles = await prisma.vehicle.findMany();
  for (const v of vehicles) {
    if (v.acquisitionCost < 100000) { // Avoid re-multiplying if already huge
      await prisma.vehicle.update({
        where: { id: v.id },
        data: { acquisitionCost: v.acquisitionCost * multiplier }
      });
    }
  }

  // 2. Trip revenue
  const trips = await prisma.trip.findMany();
  for (const t of trips) {
    if (t.revenue < 10000) {
      await prisma.trip.update({
        where: { id: t.id },
        data: { revenue: t.revenue * multiplier }
      });
    }
  }

  // 3. MaintenanceLog cost
  const logs = await prisma.maintenanceLog.findMany();
  for (const l of logs) {
    if (l.cost < 10000) {
      await prisma.maintenanceLog.update({
        where: { id: l.id },
        data: { cost: l.cost * multiplier }
      });
    }
  }

  // 4. FuelLog cost
  const fuels = await prisma.fuelLog.findMany();
  for (const f of fuels) {
    if (f.cost < 10000) {
      await prisma.fuelLog.update({
        where: { id: f.id },
        data: { cost: f.cost * multiplier }
      });
    }
  }

  // 5. Expense cost
  const expenses = await prisma.expense.findMany();
  for (const e of expenses) {
    if (e.cost < 10000) {
      await prisma.expense.update({
        where: { id: e.id },
        data: { cost: e.cost * multiplier }
      });
    }
  }

  console.log('Conversion complete!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
