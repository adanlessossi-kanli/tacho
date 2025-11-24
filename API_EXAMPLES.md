# API Examples & Testing Guide

## Base URL
```
http://localhost:3000/api
```

## Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{ "status": "ok" }
```

---

## Vehicles API

### Register Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Truck 001",
    "licensePlate": "ABC-1234"
  }'
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Truck 001",
  "licensePlate": "ABC-1234",
  "status": "active"
}
```

### List All Vehicles
```bash
curl http://localhost:3000/api/vehicles
```

Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Truck 001",
    "licensePlate": "ABC-1234",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Vehicle Details
```bash
curl http://localhost:3000/api/vehicles/550e8400-e29b-41d4-a716-446655440000
```

---

## Drivers API

### Register Driver
```bash
curl -X POST http://localhost:3000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }'
```

Response:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "status": "active"
}
```

### List All Drivers
```bash
curl http://localhost:3000/api/drivers
```

---

## Routes API

### Create Route with Stops
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Route",
    "description": "Main downtown delivery route",
    "stops": [
      {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "address": "New York, NY"
      },
      {
        "latitude": 40.7580,
        "longitude": -73.9855,
        "address": "Times Square, NY"
      },
      {
        "latitude": 40.7489,
        "longitude": -73.9680,
        "address": "Grand Central, NY"
      }
    ]
  }'
```

Response:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "Downtown Route",
  "description": "Main downtown delivery route",
  "stops": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "routeId": "770e8400-e29b-41d4-a716-446655440002",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "New York, NY",
      "sequence": 0
    }
  ]
}
```

### List All Routes
```bash
curl http://localhost:3000/api/routes
```

### Get Route Stops
```bash
curl http://localhost:3000/api/routes/770e8400-e29b-41d4-a716-446655440002/stops
```

Response:
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "routeId": "770e8400-e29b-41d4-a716-446655440002",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "New York, NY",
    "sequence": 0
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "routeId": "770e8400-e29b-41d4-a716-446655440002",
    "latitude": 40.7580,
    "longitude": -73.9855,
    "address": "Times Square, NY",
    "sequence": 1
  }
]
```

---

## Trips API

### Create Trip
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
    "driverId": "660e8400-e29b-41d4-a716-446655440001",
    "routeId": "770e8400-e29b-41d4-a716-446655440002"
  }'
```

Response:
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440005",
  "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
  "driverId": "660e8400-e29b-41d4-a716-446655440001",
  "routeId": "770e8400-e29b-41d4-a716-446655440002",
  "startTime": "2024-01-15T10:35:00.000Z",
  "status": "active"
}
```

### List All Trips
```bash
curl http://localhost:3000/api/trips
```

### Get Trip Details
```bash
curl http://localhost:3000/api/trips/990e8400-e29b-41d4-a716-446655440005
```

### End Trip
```bash
curl -X PUT http://localhost:3000/api/trips/990e8400-e29b-41d4-a716-446655440005/end
```

Response:
```json
{ "success": true }
```

---

## GPS Tracking API

### Record GPS Location
```bash
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "990e8400-e29b-41d4-a716-446655440005",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

Response:
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440006",
  "tripId": "990e8400-e29b-41d4-a716-446655440005",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

### Get GPS History
```bash
curl http://localhost:3000/api/gps/990e8400-e29b-41d4-a716-446655440005
```

Response:
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440006",
    "tripId": "990e8400-e29b-41d4-a716-446655440005",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2024-01-15T10:35:10.000Z"
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440007",
    "tripId": "990e8400-e29b-41d4-a716-446655440005",
    "latitude": 40.7150,
    "longitude": -74.0080,
    "timestamp": "2024-01-15T10:35:15.000Z"
  }
]
```

---

## WebSocket API

### Connect to WebSocket
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  // Subscribe to trip updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    tripId: '990e8400-e29b-41d4-a716-446655440005'
  }));
};

ws.onmessage = (event) => {
  const location = JSON.parse(event.data);
  console.log('Location update:', location);
  // {
  //   tripId: '990e8400-e29b-41d4-a716-446655440005',
  //   latitude: 40.7128,
  //   longitude: -74.0060,
  //   timestamp: '2024-01-15T10:35:10.000Z'
  // }
};
```

### Send Location via WebSocket
```javascript
ws.send(JSON.stringify({
  type: 'location',
  tripId: '990e8400-e29b-41d4-a716-446655440005',
  latitude: 40.7128,
  longitude: -74.0060
}));
```

---

## Complete Workflow Example

### 1. Register Vehicle
```bash
VEHICLE_ID=$(curl -s -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Truck 001","licensePlate":"ABC-1234"}' | jq -r '.id')

echo "Vehicle ID: $VEHICLE_ID"
```

### 2. Register Driver
```bash
DRIVER_ID=$(curl -s -X POST http://localhost:3000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}' | jq -r '.id')

echo "Driver ID: $DRIVER_ID"
```

### 3. Create Route
```bash
ROUTE_ID=$(curl -s -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Downtown Route",
    "description":"Main route",
    "stops":[
      {"latitude":40.7128,"longitude":-74.0060,"address":"NYC"},
      {"latitude":40.7580,"longitude":-73.9855,"address":"Times Square"}
    ]
  }' | jq -r '.id')

echo "Route ID: $ROUTE_ID"
```

### 4. Create Trip
```bash
TRIP_ID=$(curl -s -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d "{\"vehicleId\":\"$VEHICLE_ID\",\"driverId\":\"$DRIVER_ID\",\"routeId\":\"$ROUTE_ID\"}" | jq -r '.id')

echo "Trip ID: $TRIP_ID"
```

### 5. Track GPS
```bash
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d "{\"tripId\":\"$TRIP_ID\",\"latitude\":40.7128,\"longitude\":-74.0060}"
```

### 6. End Trip
```bash
curl -X PUT http://localhost:3000/api/trips/$TRIP_ID/end
```

---

## Error Responses

### Invalid Request
```json
{
  "error": "SQLITE_CONSTRAINT: UNIQUE constraint failed: vehicles.licensePlate"
}
```

### Missing Fields
```json
{
  "error": "SQLITE_CONSTRAINT: NOT NULL constraint failed: vehicles.name"
}
```

---

## Testing Tools

### Using Postman
1. Import collection from API examples
2. Set base URL to `http://localhost:3000/api`
3. Run requests in sequence

### Using Thunder Client (VS Code)
1. Create new request
2. Set method and URL
3. Add JSON body
4. Send

### Using curl (Command Line)
```bash
# All examples above use curl
# Install jq for JSON parsing: brew install jq (macOS) or apt-get install jq (Linux)
```

### Using JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Register vehicle
api.post('/vehicles', {
  name: 'Truck 001',
  licensePlate: 'ABC-1234'
}).then(res => console.log(res.data));
```

---

## Performance Testing

### Load Test GPS Tracking
```bash
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/gps \
    -H "Content-Type: application/json" \
    -d "{\"tripId\":\"$TRIP_ID\",\"latitude\":$((40 + RANDOM % 1)),\"longitude\":$((74 + RANDOM % 1))}" &
done
wait
```

### Monitor Database
```bash
sqlite3 backend/fleet.db "SELECT COUNT(*) as gps_records FROM gpsLocations;"
```

---

## Debugging

### Enable Verbose Logging
```bash
curl -v http://localhost:3000/api/vehicles
```

### Check Backend Logs
```bash
# Terminal where backend is running shows all requests
```

### Monitor WebSocket
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.onerror = (e) => console.error('Error:', e);
```
