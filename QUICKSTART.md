# Quick Start Guide

## 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Server will run on `http://localhost:3000`

## 2. Start Web Dashboard

In a new terminal:

```bash
cd web-dashboard
npm install
npm start
```

Dashboard will open at `http://localhost:3000` (React dev server)

## 3. Start Mobile App

In another terminal:

```bash
npm install
npm start
```

Follow Expo instructions to run on iOS/Android simulator or physical device.

## 4. Test the System

### Via cURL (Backend API)

**Register a Vehicle:**
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Truck 001","licensePlate":"ABC-1234"}'
```

**Register a Driver:**
```bash
curl -X POST http://localhost:3000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}'
```

**Create a Route:**
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Route A",
    "description":"Downtown route",
    "stops":[
      {"latitude":40.7128,"longitude":-74.0060,"address":"New York, NY"},
      {"latitude":40.7580,"longitude":-73.9855,"address":"Times Square"}
    ]
  }'
```

**Create a Trip:**
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":"<vehicle-id>","driverId":"<driver-id>","routeId":"<route-id>"}'
```

**Track GPS Location:**
```bash
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d '{"tripId":"<trip-id>","latitude":40.7128,"longitude":-74.0060}'
```

### Via Mobile App

1. Go to **Vehicles** tab → Add a vehicle
2. Go to **Drivers** tab → Add a driver
3. Go to **Trips** tab → Create new trip
4. Tap on trip to execute
5. Press "Start Tracking" to begin GPS tracking
6. Press "End Trip" when complete

### Via Web Dashboard

1. Open dashboard at `http://localhost:3000`
2. View fleet statistics
3. Select active trip to see live map
4. Watch real-time GPS updates

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Mobile App (React Native)              │
│  - Vehicle/Driver Registration                           │
│  - Trip Execution with GPS Tracking                      │
│  - Real-time Location Updates                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────┐
│              Backend API (Node.js/Express)               │
│  - RESTful API Endpoints                                 │
│  - SQLite Database                                       │
│  - WebSocket Server for Real-time Updates                │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────┐
│            Web Dashboard (React)                         │
│  - Live Map Visualization (Leaflet)                      │
│  - Fleet Statistics                                      │
│  - Real-time Trip Tracking                               │
└─────────────────────────────────────────────────────────┘
```

## Key Features Implemented

✅ Vehicle Registration & Tracking
✅ Driver Management
✅ Route & Stop Management
✅ Trip Scheduling & Execution
✅ Real-time GPS Tracking
✅ WebSocket-based Live Updates
✅ Mobile App with GPS Integration
✅ Web Dashboard with Live Map
✅ Fleet Statistics & Analytics

## Troubleshooting

**Backend won't start:**
- Ensure port 3000 is available
- Check Node.js version (v14+)
- Delete `fleet.db` and restart

**Mobile app can't connect to backend:**
- Update API URL in environment variables
- Ensure backend is running
- Check firewall settings

**Web dashboard not updating:**
- Verify WebSocket connection in browser console
- Check backend WebSocket server is running
- Refresh page if needed

## Next Steps

- Add authentication/authorization
- Implement trip history and analytics
- Add push notifications
- Optimize GPS tracking battery usage
- Add offline support for mobile app
- Implement trip optimization algorithms
