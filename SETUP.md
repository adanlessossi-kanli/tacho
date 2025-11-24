# Fleet Management System - MVP Setup Guide

## Project Structure

```
tacho/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── index.ts        # Main server entry
│   │   ├── database.ts     # SQLite initialization
│   │   ├── routes.ts       # API endpoints
│   │   └── websocket.ts    # Real-time GPS tracking
│   └── package.json
├── web-dashboard/          # React web dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveMap.tsx
│   │   │   └── Dashboard.css
│   │   ├── api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── src/                    # React Native mobile app
    ├── services/
    │   ├── api.ts         # API client
    │   └── gps.ts         # GPS tracking service
    ├── screens/
    │   ├── TripsScreen.tsx
    │   └── TripExecutionScreen.tsx
    └── types/
        └── index.ts
```

## Installation

### Backend Setup
```bash
cd backend
npm install
npm run build
npm run dev
```

### Mobile App Setup
```bash
npm install
npm start
```

### Web Dashboard Setup
```bash
cd web-dashboard
npm install
npm start
```

## Environment Variables

Create `.env` files:

**backend/.env**
```
PORT=3000
NODE_ENV=development
```

**web-dashboard/.env**
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000
```

**Mobile app (app.json)**
```json
{
  "expo": {
    "extra": {
      "API_URL": "http://localhost:3000/api"
    }
  }
}
```

## Features

### Vehicle Registration & Tracking
- Register vehicles with license plate
- Track vehicle status (active/inactive/maintenance)
- View all registered vehicles

### Route & Stop Management
- Create routes with multiple stops
- Define stop coordinates and addresses
- Assign routes to trips

### Trip Scheduling & Execution
- Create trips with vehicle and driver assignment
- Start/end trips
- Track trip status (scheduled/active/completed)

### Real-time GPS Tracking
- Continuous GPS location updates from mobile app
- WebSocket-based real-time broadcasting
- GPS history storage

### Driver Mobile App
- Trip execution interface
- GPS tracking controls
- Route stop visualization
- Trip start/end management

### Manager Web Dashboard
- Live map visualization with Leaflet
- Real-time vehicle tracking
- Fleet statistics (active vehicles, drivers, trips)
- Trip and vehicle management

## API Endpoints

### Vehicles
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles` - List vehicles
- `GET /api/vehicles/:id` - Get vehicle details

### Drivers
- `POST /api/drivers` - Register driver
- `GET /api/drivers` - List drivers

### Routes
- `POST /api/routes` - Create route with stops
- `GET /api/routes` - List routes
- `GET /api/routes/:id/stops` - Get route stops

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - List trips
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id/end` - End trip

### GPS Tracking
- `POST /api/gps` - Record GPS location
- `GET /api/gps/:tripId` - Get GPS history

### WebSocket
- Subscribe to trip: `{ type: 'subscribe', tripId: 'xxx' }`
- Send location: `{ type: 'location', tripId: 'xxx', latitude: 0, longitude: 0 }`

## Running the MVP

1. Start backend server:
   ```bash
   cd backend && npm run dev
   ```

2. Start web dashboard:
   ```bash
   cd web-dashboard && npm start
   ```

3. Start mobile app:
   ```bash
   npm start
   ```

## Testing Workflow

1. Register a vehicle via API or mobile app
2. Register a driver via API or mobile app
3. Create a route with stops
4. Create a trip with vehicle, driver, and route
5. Start trip execution on mobile app
6. Monitor real-time tracking on web dashboard
7. End trip when complete

## Database

SQLite database is automatically created at `backend/fleet.db` with tables:
- vehicles
- drivers
- routes
- stops
- trips
- gpsLocations
