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

**POST /api/fuel**
- Request: `{ vehicleId, liters, cost }`
- Response: `FuelLog`

**POST /api/expenses**
- Request: `{ vehicleId, description, cost, type }` (type: Tolls, Misc)
- Response: `Expense`

## Dashboard & Reports (M4 / M1)
**GET /api/reports/dashboard**
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
