# Backend API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication

All endpoints (except `/auth/login`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "role": "driver" | "manager" | "admin"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "user@example.com",
    "role": "driver"
  }
}
```

**Status:** 200 OK

---

### Verify Token
```
POST /auth/verify
```

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "userId": "user-id",
    "email": "user@example.com",
    "role": "driver"
  }
}
```

**Status:** 200 OK | 401 Unauthorized

---

## Vehicle Endpoints

### Create Vehicle
```
POST /vehicles
```

**Request:**
```json
{
  "name": "Truck 001",
  "licensePlate": "ABC-1234"
}
```

**Response:**
```json
{
  "id": "vehicle-id",
  "name": "Truck 001",
  "licensePlate": "ABC-1234",
  "status": "active"
}
```

**Status:** 200 OK | 400 Bad Request

---

### List Vehicles
```
GET /vehicles
```

**Response:**
```json
[
  {
    "id": "vehicle-id",
    "name": "Truck 001",
    "licensePlate": "ABC-1234",
    "status": "active",
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

**Status:** 200 OK

---

### Get Vehicle
```
GET /vehicles/:id
```

**Response:**
```json
{
  "id": "vehicle-id",
  "name": "Truck 001",
  "licensePlate": "ABC-1234",
  "status": "active",
  "createdAt": "2024-01-01T12:00:00Z"
}
```

**Status:** 200 OK | 404 Not Found

---

## Driver Endpoints

### Create Driver
```
POST /drivers
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "id": "driver-id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "status": "active"
}
```

**Status:** 200 OK | 400 Bad Request

---

### List Drivers
```
GET /drivers
```

**Response:**
```json
[
  {
    "id": "driver-id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "status": "active",
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

**Status:** 200 OK

---

## Route Endpoints

### Create Route
```
POST /routes
```

**Request:**
```json
{
  "name": "Downtown Route",
  "description": "Daily downtown deliveries",
  "stops": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St"
    }
  ]
}
```

**Response:**
```json
{
  "id": "route-id",
  "name": "Downtown Route",
  "description": "Daily downtown deliveries",
  "stops": []
}
```

**Status:** 200 OK | 400 Bad Request

---

### List Routes
```
GET /routes
```

**Response:**
```json
[
  {
    "id": "route-id",
    "name": "Downtown Route",
    "description": "Daily downtown deliveries",
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

**Status:** 200 OK

---

### Get Route Stops
```
GET /routes/:id/stops
```

**Response:**
```json
[
  {
    "id": "stop-id",
    "routeId": "route-id",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St",
    "sequence": 0
  }
]
```

**Status:** 200 OK | 404 Not Found

---

## Trip Endpoints

### Create Trip
```
POST /trips
```

**Request:**
```json
{
  "vehicleId": "vehicle-id",
  "driverId": "driver-id",
  "routeId": "route-id"
}
```

**Response:**
```json
{
  "id": "trip-id",
  "vehicleId": "vehicle-id",
  "driverId": "driver-id",
  "routeId": "route-id",
  "startTime": "2024-01-01T12:00:00Z",
  "status": "active"
}
```

**Status:** 200 OK | 400 Bad Request

---

### List Trips
```
GET /trips
```

**Response:**
```json
[
  {
    "id": "trip-id",
    "vehicleId": "vehicle-id",
    "driverId": "driver-id",
    "routeId": "route-id",
    "startTime": "2024-01-01T12:00:00Z",
    "endTime": null,
    "distance": 0,
    "status": "active"
  }
]
```

**Status:** 200 OK

---

### Get Trip
```
GET /trips/:id
```

**Response:**
```json
{
  "id": "trip-id",
  "vehicleId": "vehicle-id",
  "driverId": "driver-id",
  "routeId": "route-id",
  "startTime": "2024-01-01T12:00:00Z",
  "endTime": null,
  "distance": 0,
  "status": "active"
}
```

**Status:** 200 OK | 404 Not Found

---

### End Trip
```
PUT /trips/:id/end
```

**Response:**
```json
{
  "success": true,
  "distance": 25.5
}
```

**Status:** 200 OK | 400 Bad Request

---

## GPS Endpoints

### Record GPS Location
```
POST /gps
```

**Request:**
```json
{
  "tripId": "trip-id",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "id": "gps-id",
  "tripId": "trip-id",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Status:** 200 OK | 400 Bad Request

---

### Get GPS History
```
GET /gps/:tripId
```

**Response:**
```json
[
  {
    "id": "gps-id",
    "tripId": "trip-id",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2024-01-01T12:00:00Z"
  }
]
```

**Status:** 200 OK | 404 Not Found

---

## Geospatial Endpoints

### Calculate Distance
```
POST /geospatial/distance
```

**Request:**
```json
{
  "loc1": { "latitude": 40.7128, "longitude": -74.0060 },
  "loc2": { "latitude": 40.7580, "longitude": -73.9855 }
}
```

**Response:**
```json
{
  "distance": 5.2
}
```

**Status:** 200 OK

---

### Estimate ETA
```
POST /geospatial/eta
```

**Request:**
```json
{
  "currentLoc": { "latitude": 40.7128, "longitude": -74.0060 },
  "destination": { "latitude": 40.7580, "longitude": -73.9855 },
  "avgSpeed": 50
}
```

**Response:**
```json
{
  "eta": 6
}
```

**Status:** 200 OK

---

### Check Geofence
```
POST /geospatial/geofence-check
```

**Request:**
```json
{
  "location": { "latitude": 40.7128, "longitude": -74.0060 },
  "geofence": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusKm": 1
  }
}
```

**Response:**
```json
{
  "isInside": true
}
```

**Status:** 200 OK

---

## Report Endpoints

### Get Reports
```
GET /reports
```

**Authorization:** Manager or Admin role required

**Response:**
```json
[
  {
    "id": "report-1234567890",
    "type": "daily",
    "generatedAt": "2024-01-01T00:00:00Z",
    "data": {
      "tripsToday": 15,
      "distanceToday": 250.5,
      "vehiclesUsedToday": 8
    }
  }
]
```

**Status:** 200 OK | 403 Forbidden

---

### Generate Report
```
POST /reports/generate
```

**Authorization:** Manager or Admin role required

**Response:**
```json
{
  "id": "report-1234567890",
  "type": "daily",
  "generatedAt": "2024-01-01T00:00:00Z",
  "data": {
    "tripsToday": 15,
    "distanceToday": 250.5,
    "vehiclesUsedToday": 8
  }
}
```

**Status:** 200 OK | 403 Forbidden

---

### Get Analytics
```
GET /analytics
```

**Authorization:** Manager or Admin role required

**Response:**
```json
{
  "totalVehicles": 10,
  "totalDrivers": 15,
  "completedTrips": 150,
  "avgDistance": 25.5
}
```

**Status:** 200 OK | 403 Forbidden

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## WebSocket Protocol

### Connection
```
ws://localhost:3000
```

### Subscribe to Trip
```json
{
  "type": "subscribe",
  "tripId": "trip-id"
}
```

### Send Location
```json
{
  "type": "location",
  "tripId": "trip-id",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Receive Location Update
```json
{
  "tripId": "trip-id",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Health Check

### Server Status
```
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status:** 200 OK
