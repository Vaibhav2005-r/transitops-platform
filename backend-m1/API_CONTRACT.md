# TransitOps — API Contract

This document outlines the API endpoints, request/response payloads, validation rules, and status state machines for the **TransitOps Smart Transport Operations Platform**.

---

## 1. Global Concepts & Enums

### 1.1 Content Types & Headers
All requests and responses use `application/json` unless otherwise specified.
For authenticated endpoints, pass the JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

### 1.2 Status Enums

#### Vehicle Status
- `Available` - Ready for dispatch.
- `On Trip` - Currently assigned to an active trip.
- `In Shop` - Under maintenance.
- `Retired` - Out of service permanently.

#### Driver Status
- `Available` - Ready for assignment.
- `On Trip` - Currently driving an active trip.
- `Off Duty` - Not working.
- `Suspended` - Forbidden from driving due to safety/license issues.

#### Trip Status
- `Draft` - Created but not yet dispatched.
- `Dispatched` - Active, vehicle and driver are en route.
- `Completed` - Trip successfully finished.
- `Cancelled` - Aborted before completion.

---

## 2. Authentication API (`/api/auth`)

### 2.1 Register User
- **Method / Path**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "manager@transitops.com",
    "password": "SecurePassword123",
    "roleName": "Fleet Manager"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "manager@transitops.com",
      "role": "Fleet Manager"
    }
  }
  ```
- **Response (400 Bad Request)**:
  ```json
  {
    "error": "Email already exists or invalid role."
  }
  ```

### 2.2 Login User
- **Method / Path**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "manager@transitops.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "role": "Fleet Manager",
    "user": {
      "id": 1,
      "email": "manager@transitops.com",
      "roleId": 2
    }
  }
  ```
- **Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid email or password."
  }
  ```

---

## 3. Vehicles API (`/api/vehicles`)

### 3.1 Create Vehicle
- **Method / Path**: `POST /api/vehicles`
- **Permissions**: `Fleet Manager`
- **Request Body**:
  ```json
  {
    "registrationNumber": "VAN-05",
    "make": "Ford",
    "model": "Transit",
    "capacityWeight": 1500.0,
    "acquisitionCost": 35000.0
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 5,
    "registrationNumber": "VAN-05",
    "make": "Ford",
    "model": "Transit",
    "capacityWeight": 1500.0,
    "acquisitionCost": 35000.0,
    "status": "Available"
  }
  ```

### 3.2 List Vehicles
- **Method / Path**: `GET /api/vehicles`
- **Query Parameters**:
  - `status` (optional): `Available`, `On Trip`, `In Shop`, `Retired`
  - `make` (optional): Filter by brand
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 5,
      "registrationNumber": "VAN-05",
      "make": "Ford",
      "model": "Transit",
      "capacityWeight": 1500.0,
      "acquisitionCost": 35000.0,
      "status": "Available"
    }
  ]
  ```

### 3.3 Get Vehicle Details
- **Method / Path**: `GET /api/vehicles/:id`
- **Response (200 OK)**:
  ```json
  {
    "id": 5,
    "registrationNumber": "VAN-05",
    "make": "Ford",
    "model": "Transit",
    "capacityWeight": 1500.0,
    "acquisitionCost": 35000.0,
    "status": "Available",
    "maintenanceLogs": [],
    "fuelLogs": [],
    "expenses": []
  }
  ```

### 3.4 Update Vehicle
- **Method / Path**: `PUT /api/vehicles/:id`
- **Permissions**: `Fleet Manager`
- **Request Body**:
  ```json
  {
    "make": "Ford",
    "model": "Transit Gen 2",
    "capacityWeight": 1600.0,
    "status": "In Shop"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 5,
    "registrationNumber": "VAN-05",
    "make": "Ford",
    "model": "Transit Gen 2",
    "capacityWeight": 1600.0,
    "acquisitionCost": 35000.0,
    "status": "In Shop"
  }
  ```

### 3.5 Delete Vehicle
- **Method / Path**: `DELETE /api/vehicles/:id`
- **Permissions**: `Fleet Manager`
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## 4. Drivers API (`/api/drivers`)

### 4.1 Create Driver
- **Method / Path**: `POST /api/drivers`
- **Permissions**: `Fleet Manager`, `Safety Officer`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "licenseNumber": "DL-987654321",
    "licenseExpiryDate": "2027-12-31T00:00:00.000Z",
    "safetyScore": 95
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 3,
    "name": "Jane Doe",
    "licenseNumber": "DL-987654321",
    "licenseExpiryDate": "2027-12-31T00:00:00.000Z",
    "safetyScore": 95,
    "status": "Available"
  }
  ```

### 4.2 List Drivers
- **Method / Path**: `GET /api/drivers`
- **Query Parameters**:
  - `status` (optional): `Available`, `On Trip`, `Off Duty`, `Suspended`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 3,
      "name": "Jane Doe",
      "licenseNumber": "DL-987654321",
      "licenseExpiryDate": "2027-12-31T00:00:00.000Z",
      "safetyScore": 95,
      "status": "Available"
    }
  ]
  ```

### 4.3 Get Driver Details
- **Method / Path**: `GET /api/drivers/:id`
- **Response (200 OK)**:
  ```json
  {
    "id": 3,
    "name": "Jane Doe",
    "licenseNumber": "DL-987654321",
    "licenseExpiryDate": "2027-12-31T00:00:00.000Z",
    "safetyScore": 95,
    "status": "Available",
    "trips": []
  }
  ```

### 4.4 Update Driver
- **Method / Path**: `PUT /api/drivers/:id`
- **Permissions**: `Fleet Manager`, `Safety Officer`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "licenseExpiryDate": "2028-12-31T00:00:00.000Z",
    "safetyScore": 98,
    "status": "Off Duty"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 3,
    "name": "Jane Doe",
    "licenseNumber": "DL-987654321",
    "licenseExpiryDate": "2028-12-31T00:00:00.000Z",
    "safetyScore": 98,
    "status": "Off Duty"
  }
  ```

### 4.5 Delete Driver
- **Method / Path**: `DELETE /api/drivers/:id`
- **Permissions**: `Fleet Manager`, `Safety Officer`
- **Response (204 No Content)**: (Empty body)

---

## 5. Trips API (`/api/trips`)

### 5.1 Create Trip (Draft)
- **Method / Path**: `POST /api/trips`
- **Permissions**: `Fleet Manager`
- **Request Body**:
  ```json
  {
    "vehicleId": 5,
    "driverId": 3,
    "source": "Warehouse A",
    "destination": "Retailer B",
    "cargoWeight": 1200.0,
    "distance": 150.0
  }
  ```
- **Validation Rules & Failures**:
  - **Rule 1**: The selected Vehicle must not be `Retired` or `In Shop`.
  - **Rule 2**: The selected Driver must not have an expired license (checked against the current local date `2026-07-12`) or be `Suspended`.
  - **Rule 3**: Cargo weight must not exceed the vehicle's capacity weight.
  - **Error Response (400 Bad Request)**:
    ```json
    {
      "error": "Validation failed: Cargo weight exceeds vehicle capacity of 1500 kg."
    }
    ```
- **Response (201 Created)**:
  ```json
  {
    "id": 10,
    "vehicleId": 5,
    "driverId": 3,
    "source": "Warehouse A",
    "destination": "Retailer B",
    "cargoWeight": 1200.0,
    "distance": 150.0,
    "revenue": 0.0,
    "status": "Draft",
    "createdAt": "2026-07-12T09:30:00.000Z"
  }
  ```

### 5.2 Transition Trip: Update Status (Dispatch / Complete / Cancel)
- **Method / Path**: `PUT /api/trips/:id/status`
- **Permissions**: `Fleet Manager`
- **Request Body**:
  ```json
  {
    "status": "Dispatched"
  }
  ```
- **Transition Workflows**:
  - **Draft -> Dispatched**:
    - Validation: Vehicle and Driver must currently be `Available`.
    - Side Effect: Automatically sets Vehicle and Driver status to `On Trip`.
  - **Dispatched -> Completed**:
    - Side Effect: Automatically sets Vehicle and Driver status back to `Available`.
  - **Dispatched -> Cancelled**:
    - Side Effect: Automatically restores Vehicle and Driver status to `Available`.
- **Response (200 OK)**:
  ```json
  {
    "id": 10,
    "vehicleId": 5,
    "driverId": 3,
    "source": "Warehouse A",
    "destination": "Retailer B",
    "cargoWeight": 1200.0,
    "distance": 150.0,
    "status": "Dispatched",
    "createdAt": "2026-07-12T09:30:00.000Z"
  }
  ```

---

## 6. Maintenance Logs API (`/api/maintenance`)

### 6.1 Create Maintenance Log (Auto-Shop)
- **Method / Path**: `POST /api/maintenance`
- **Permissions**: `Fleet Manager`, `Safety Officer`
- **Request Body**:
  ```json
  {
    "vehicleId": 5,
    "description": "Routine 10k mile oil change and brake pad check",
    "cost": 250.0
  }
  ```
- **Side Effects**: Automatically sets the vehicle's status to `In Shop`.
- **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "vehicleId": 5,
    "description": "Routine 10k mile oil change and brake pad check",
    "cost": 250.0,
    "date": "2026-07-12T09:35:00.000Z"
  }
  ```

### 6.2 Close Maintenance Log (Auto-Available)
- **Method / Path**: `PUT /api/maintenance/:id/close`
- **Permissions**: `Fleet Manager`, `Safety Officer`
- **Request Body**: `{}`
- **Side Effects**: Restores the vehicle's status to `Available` (unless the vehicle status has been explicitly set to `Retired`).
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "vehicleId": 5,
    "description": "Routine 10k mile oil change and brake pad check",
    "cost": 250.0,
    "date": "2026-07-12T09:35:00.000Z"
  }
  ```

---

## 7. Fuel & Expense APIs (`/api/fuel`, `/api/expenses`)

### 7.1 Record Fuel Log
- **Method / Path**: `POST /api/fuel`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Request Body**:
  ```json
  {
    "vehicleId": 5,
    "liters": 45.5,
    "cost": 90.0
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "vehicleId": 5,
    "liters": 45.5,
    "cost": 90.0,
    "date": "2026-07-12T09:40:00.000Z"
  }
  ```

### 7.2 List Expenses
- **Method / Path**: `GET /api/expenses`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "vehicleId": 5,
      "description": "Highway Toll Tollgate 3",
      "cost": 15.0,
      "type": "Tolls",
      "date": "2026-07-12T09:40:00.000Z"
    }
  ]
  ```

### 7.3 Record Other Expense
- **Method / Path**: `POST /api/expenses`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Request Body**:
  ```json
  {
    "vehicleId": 5,
    "description": "Highway Toll Tollgate 3",
    "cost": 15.0,
    "type": "Tolls"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 1,
    "vehicleId": 5,
    "description": "Highway Toll Tollgate 3",
    "cost": 15.0,
    "type": "Tolls",
    "date": "2026-07-12T09:40:00.000Z"
  }
  ```

### 7.4 Update Expense
- **Method / Path**: `PUT /api/expenses/:id`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Request Body**:
  ```json
  {
    "description": "Highway Toll Tollgate 3 (Updated)",
    "cost": 18.0,
    "type": "Tolls"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "vehicleId": 5,
    "description": "Highway Toll Tollgate 3 (Updated)",
    "cost": 18.0,
    "type": "Tolls",
    "date": "2026-07-12T09:40:00.000Z"
  }
  ```

### 7.5 Delete Expense
- **Method / Path**: `DELETE /api/expenses/:id`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## 8. Dashboard & Reports API (`/api/dashboard`, `/api/reports`)

### 8.1 Dashboard KPIs
- **Method / Path**: `GET /api/reports/dashboard`
- **Permissions**: All authenticated roles
- **Query Parameters**:
  - `vehicleType` (optional)
  - `status` (optional)
  - `region` (optional)
- **Response (200 OK)**:
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

### 8.2 Vehicle Analytics & ROI Report
- **Method / Path**: `GET /api/reports/vehicle/:id/analytics`
- **Permissions**: `Fleet Manager`, `Financial Analyst`
- **Report Formulas**:
  - **Fuel Efficiency** = `Total Trip Distance` / `Total Fuel Liters`
  - **Operational Cost** = `Total Maintenance Costs` + `Total Fuel Costs` + `Total Expense Costs`
  - **Vehicle ROI** = `(Total Revenue - Operational Cost) / Acquisition Cost`
- **Response (200 OK)**:
  ```json
  {
    "fuelEfficiency": 12.5,
    "operationalCost": 1500.0,
    "roi": 15.2
  }
  ```
