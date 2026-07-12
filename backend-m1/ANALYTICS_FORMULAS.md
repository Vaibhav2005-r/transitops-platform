# TransitOps: Analytics Formulas & Schema Mapping
**Owner:** M3 (Financial/Maintenance Logic)
**Phase:** Hour 1 Checkpoint

This document explicitly defines the 4 core formulas required for the TransitOps analytics dashboard and confirms that the Prisma schema has all the necessary inputs to calculate them in Hour 5.

---

### 1. Fuel Efficiency (Kilometers per Liter)
**Formula:** `Total Distance Traveled / Total Liters of Fuel Consumed`
**Schema Inputs Confirmed:**
- **Distance:** `Trip.distance` (Float) - *We sum this up for all completed trips of a specific vehicle.*
- **Fuel:** `FuelLog.liters` (Float) - *We sum this up for a specific vehicle over a given time period.*

### 2. Fleet Utilization (%)
**Formula:** `(Active Vehicles / Total Fleet Size) * 100`
**Schema Inputs Confirmed:**
- **Active Vehicles:** Count of `Vehicle` where `status == "On Trip"`
- **Total Fleet:** Count of all `Vehicle` (excluding `status == "Retired"`)
- *Note:* The `Vehicle.status` enum field is correctly configured to support these states.

### 3. Operational Cost ($)
**Formula:** `Total Maintenance Cost + Total Fuel Cost + Total Other Expenses`
**Schema Inputs Confirmed:**
- **Maintenance:** `MaintenanceLog.cost` (Float)
- **Fuel:** `FuelLog.cost` (Float)
- **Other Expenses:** `Expense.cost` (Float)
- *Note:* We will sum all three of these tables by `vehicleId` to get the true Operational Cost per vehicle.

### 4. Vehicle ROI (Return on Investment)
**Formula:** `((Total Revenue - Total Operational Cost) / Acquisition Cost) * 100`
**Schema Inputs Confirmed:**
- **Revenue:** `Trip.revenue` (Float) - *Sum of revenue from all completed trips for the vehicle.*
- **Operational Cost:** (Calculated from Formula #3 above)
- **Acquisition Cost:** `Vehicle.acquisitionCost` (Float) - *Successfully added by M1 to the Vehicle model.*

---
**Conclusion:** 
All inputs required for Hour 5 Analytics are successfully mapped and present in the current `schema.prisma`. No further schema alterations are needed for M3's deliverables.
