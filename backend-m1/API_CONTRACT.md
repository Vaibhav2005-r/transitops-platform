# TransitOps API Contract

## Authentication (M1)
**POST /api/auth/login**
- Request: `{ email, password }`
- Response: `{ token, role, user: { id, email, roleId } }`

## Vehicles (M1)
**GET /api/vehicles**
- Response: `Vehicle[]`

**POST /api/vehicles**
- Request: `{ registrationNumber, make, model, capacityWeight }`
- Response: `Vehicle`

**PUT /api/vehicles/:id**
- Request: `{ status }` (Available, On Trip, In Shop, Retired)
- Response: `Vehicle`

**DELETE /api/vehicles/:id**
- Response: `{ success: true }`

## Drivers & Trips (M2)
**GET /api/drivers**
- Response: `Driver[]`

**POST /api/drivers**
- Request: `{ name, licenseNumber, licenseExpiryDate }`
- Response: `Driver`

**GET /api/trips**
- Response: `Trip[]`

**POST /api/trips**
- Request: `{ vehicleId, driverId, source, destination, cargoWeight, distance }`
- Response: `Trip`

**PUT /api/trips/:id/status**
- Request: `{ status }` (Draft, Dispatched, Completed, Cancelled)
- Response: `Trip`

## Maintenance, Fuel, Expenses (M3)
**POST /api/maintenance**
- Request: `{ vehicleId, description, cost }`
- Response: `MaintenanceLog`
- *Side Effect: Updates Vehicle status to 'In Shop'*

**PUT /api/maintenance/:id/close**
- Request: `{}`
- Response: `MaintenanceLog`
- *Side Effect: Restores Vehicle status to 'Available'*

**POST /api/fuel**
- Request: `{ vehicleId, liters, cost }`
- Response: `FuelLog`

**GET /api/expenses**
- Response: `Expense[]`

**POST /api/expenses**
- Request: `{ vehicleId, description, cost, type }` (type: Tolls, Misc)
- Response: `Expense`

**PUT /api/expenses/:id**
- Request: `{ description, cost, type }`
- Response: `Expense`

**DELETE /api/expenses/:id**
- Response: `{ success: true }`

## Dashboard & Reports (M4 / M1 / M3)
**GET /api/reports/dashboard** (M1/M4)
- Query params: `?vehicleType=&status=&region=`
- Response:
```json
{
  "activeVehicles": 10,
  "availableVehicles": 5,
  "vehiclesInMaintenance": 2,
  "activeTrips": 3,
  "pendingTrips": 1,
  "driversOnDuty": 4,
  "fleetUtilization": 85.5
}
```

**GET /api/reports/vehicle/:id/analytics** (M3)
- Response:
```json
{
  "fuelEfficiency": 12.5, // Distance / Fuel
  "operationalCost": 1500, // Maintenance + Fuel + Expenses
  "roi": 15.2 // (Revenue - Operational Cost) / Acquisition Cost
}
```
