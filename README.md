# Tacho - Fleet Management System MVP

A comprehensive fleet management solution with real-time GPS tracking, vehicle/driver management, route planning, and live web dashboard.

## Features

### Core Functionality
- **Vehicle Registration & Tracking** - Register vehicles and track their status
- **Driver Management** - Manage driver profiles and assignments
- **Route & Stop Management** - Create routes with multiple stops and coordinates
- **Trip Scheduling & Execution** - Schedule and execute trips with real-time tracking
- **Real-time GPS Tracking** - Continuous GPS location updates via WebSocket
- **Live Map Visualization** - Interactive map with real-time vehicle positions
- **Fleet Dashboard** - Manager web interface with statistics and analytics

### Components

#### Backend API (Node.js/Express)
- RESTful API for all fleet operations
- SQLite database for persistent storage
- WebSocket server for real-time GPS broadcasting
- Automatic database initialization

#### Mobile App (React Native/Expo)
- Vehicle and driver registration
- Trip execution interface
- GPS tracking with Expo Location API
- Route stop visualization
- Real-time trip management

#### Web Dashboard (React)
- Live map with Leaflet
- Fleet statistics and KPIs
- Active trip monitoring
- Vehicle and driver lists
- Real-time location updates via WebSocket

## Project Structure

```
tacho/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── database.ts        # SQLite schema & init
│   │   ├── routes.ts          # API endpoints
│   │   └── websocket.ts       # Real-time updates
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── web-dashboard/             # React web app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveMap.tsx
│   │   │   └── Dashboard.css
│   │   ├── api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
│
├── src/                       # React Native mobile app
│   ├── services/
│   │   ├── api.ts            # API client
│   │   └── gps.ts            # GPS tracking
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── VehiclesScreen.tsx
│   │   ├── DriversScreen.tsx
│   │   ├── TripsScreen.tsx
│   │   └── TripExecutionScreen.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   └── types/
│       └── index.ts
│
├── SETUP.md                   # Detailed setup guide
├── QUICKSTART.md              # Quick start instructions
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js v14+
- npm or yarn
- Expo CLI (for mobile app)

### Backend Setup

```bash
cd backend
npm install
npm run build
npm run dev
```

Backend runs on `http://localhost:3000`

### Web Dashboard Setup

```bash
cd web-dashboard
npm install
npm start
```

Dashboard runs on `http://localhost:3000` (React dev server)

### Mobile App Setup

```bash
npm install
npm start
```

Follow Expo prompts to run on simulator or device.

## API Endpoints

### Vehicles
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details

### Drivers
- `POST /api/drivers` - Register driver
- `GET /api/drivers` - List all drivers

### Routes
- `POST /api/routes` - Create route with stops
- `GET /api/routes` - List all routes
- `GET /api/routes/:id/stops` - Get route stops

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - List all trips
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id/end` - End trip

### GPS Tracking
- `POST /api/gps` - Record GPS location
- `GET /api/gps/:tripId` - Get GPS history

### WebSocket
- Subscribe: `{ type: 'subscribe', tripId: 'xxx' }`
- Publish: `{ type: 'location', tripId: 'xxx', latitude: 0, longitude: 0 }`

## Usage Workflow

1. **Register Fleet Assets**
   - Add vehicles via mobile app or API
   - Add drivers via mobile app or API

2. **Plan Routes**
   - Create routes with multiple stops
   - Define stop coordinates and addresses

3. **Schedule Trips**
   - Create trips with vehicle, driver, and route
   - Assign trips to drivers

4. **Execute Trips**
   - Driver starts trip on mobile app
   - GPS tracking begins automatically
   - Manager monitors on web dashboard

5. **Complete Trips**
   - Driver ends trip when complete
   - Trip data saved for analytics

## Database Schema

### vehicles
- id (TEXT PRIMARY KEY)
- name (TEXT)
- licensePlate (TEXT UNIQUE)
- status (TEXT)
- createdAt (DATETIME)

### drivers
- id (TEXT PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- phone (TEXT)
- status (TEXT)
- createdAt (DATETIME)

### routes
- id (TEXT PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- createdAt (DATETIME)

### stops
- id (TEXT PRIMARY KEY)
- routeId (TEXT FOREIGN KEY)
- latitude (REAL)
- longitude (REAL)
- address (TEXT)
- sequence (INTEGER)

### trips
- id (TEXT PRIMARY KEY)
- vehicleId (TEXT FOREIGN KEY)
- driverId (TEXT FOREIGN KEY)
- routeId (TEXT FOREIGN KEY)
- startTime (DATETIME)
- endTime (DATETIME)
- distance (REAL)
- status (TEXT)

### gpsLocations
- id (TEXT PRIMARY KEY)
- tripId (TEXT FOREIGN KEY)
- latitude (REAL)
- longitude (REAL)
- timestamp (DATETIME)

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
```

### Web Dashboard (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000
```

### Mobile App (app.json)
```json
{
  "expo": {
    "extra": {
      "API_URL": "http://localhost:3000/api"
    }
  }
}
```

## Testing

### Quick Test with cURL

```bash
# Register vehicle
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{"name":"Truck 001","licensePlate":"ABC-1234"}'

# Register driver
curl -X POST http://localhost:3000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}'

# Create trip
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{"vehicleId":"<id>","driverId":"<id>"}'

# Track GPS
curl -X POST http://localhost:3000/api/gps \
  -H "Content-Type: application/json" \
  -d '{"tripId":"<id>","latitude":40.7128,"longitude":-74.0060}'
```

## Technologies Used

### Backend
- Node.js & Express.js
- TypeScript
- SQLite3
- WebSocket (ws)
- CORS

### Mobile App
- React Native
- Expo
- React Navigation
- Axios
- Expo Location

### Web Dashboard
- React
- Leaflet (Maps)
- Axios
- CSS3

## Performance Considerations

- GPS tracking interval: 5 seconds (configurable)
- Distance threshold: 10 meters (to reduce noise)
- WebSocket for real-time updates (vs polling)
- SQLite for lightweight local storage
- Stateless API design for scalability

## Security Notes

- Add authentication/authorization before production
- Validate all API inputs
- Use HTTPS in production
- Implement rate limiting
- Secure WebSocket connections (WSS)
- Add data encryption for sensitive fields

## Future Enhancements

- User authentication & role-based access
- Trip history and analytics
- Push notifications
- Offline support
- Battery optimization for GPS
- Trip optimization algorithms
- Geofencing alerts
- Driver behavior analytics
- Integration with mapping services
- Mobile app for managers

## Troubleshooting

**Backend won't start:**
- Check port 3000 availability
- Verify Node.js version
- Delete `fleet.db` and restart

**Mobile app connection issues:**
- Update API URL in environment
- Ensure backend is running
- Check network connectivity

**Web dashboard not updating:**
- Verify WebSocket connection
- Check browser console for errors
- Refresh page if needed

## License

MIT

## Support

For issues or questions, refer to SETUP.md and QUICKSTART.md for detailed instructions.
