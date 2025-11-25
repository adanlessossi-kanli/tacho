# Tacho Fleet Management - Feature Documentation

## Driver Mobile App Features

### Trip Tracking
- **Start/Stop GPS Tracking**: Real-time GPS location updates every 5 seconds
- **Trip Status**: View current trip status (active/completed)
- **Trip Details**: Vehicle ID, Driver ID, start time

### Stop Management
- **Log Arrivals**: Record arrival time at each stop
- **Log Departures**: Record departure time from each stop
- **Stop History**: View all logged stops with timestamps
- **Route Visualization**: See all stops on the route with coordinates

### Trip Execution
- **Current Stop Display**: Shows next stop address and coordinates
- **Stop Progress**: Track progress through route (e.g., 3/5 stops)
- **End Trip**: Complete trip and save all data
- **GPS Status Indicator**: Visual indicator showing if tracking is active

### Navigation
- Dashboard: Fleet statistics overview
- Vehicles: Register and manage vehicles
- Drivers: Register and manage drivers
- Trips: Create and manage trips
- Trip Execution: Execute active trips with GPS tracking
- Settings: App configuration

---

## Manager Dashboard Features

### Real-Time Monitoring
- **Live Map**: Interactive map showing vehicle locations
- **Active Trips**: List of all active trips with vehicle and driver info
- **Vehicle List**: All registered vehicles with status
- **Auto-Refresh**: Data updates every 5 seconds

### Fleet Statistics
- **Active Vehicles**: Count of vehicles currently in use
- **Total Drivers**: Total registered drivers
- **Active Trips**: Number of ongoing trips
- **Completed Trips**: Historical trip count

### Reports & Analytics
- **Fleet Summary**: Overview of all fleet metrics
- **Trip History**: Detailed table of all trips with:
  - Trip ID
  - Vehicle name
  - Driver name
  - Trip status
  - Start/end times
  - Distance traveled
- **Export Report**: Download fleet data as JSON file

### Trip Monitoring
- **Select Active Trip**: Click any trip to view on map
- **Trip Details**: Vehicle, driver, start time
- **GPS History**: View complete GPS path for selected trip
- **Real-time Updates**: Live location streaming via WebSocket

### Vehicle Management
- **Vehicle Status**: Active/inactive status display
- **License Plate**: Vehicle identification
- **Status Badges**: Visual indicators for vehicle status

---

## API Integration

### Driver App Endpoints
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles` - List vehicles
- `POST /api/drivers` - Register driver
- `GET /api/drivers` - List drivers
- `POST /api/trips` - Create trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id/end` - End trip
- `POST /api/gps` - Send GPS location
- `GET /api/routes/:id/stops` - Get route stops

### Dashboard Endpoints
- `GET /api/vehicles` - List all vehicles
- `GET /api/drivers` - List all drivers
- `GET /api/trips` - List all trips
- `GET /api/gps/:tripId` - Get GPS history
- WebSocket: Real-time GPS updates

---

## Data Flow

### Trip Execution Flow
1. Driver creates trip (vehicle + driver selection)
2. Driver navigates to Trip Execution screen
3. Driver starts GPS tracking
4. GPS updates sent to backend every 5 seconds
5. Driver logs arrival at each stop
6. Driver logs departure from each stop
7. Manager sees real-time updates on dashboard
8. Driver ends trip when complete
9. Trip data saved with all stop logs and GPS history

### Manager Monitoring Flow
1. Manager opens dashboard
2. Dashboard loads all vehicles, drivers, trips
3. Manager selects active trip to view on map
4. Map displays GPS history and current location
5. WebSocket connection streams live GPS updates
6. Manager can view trip history and generate reports
7. Manager can export fleet data

---

## Configuration

### Driver App
- Edit `src/config.ts` to change API URL
- Default: `http://192.168.1.100:3000/api`

### Manager Dashboard
- Edit `web-dashboard/.env` for API and WebSocket URLs
- Default: `http://localhost:3000/api` and `ws://localhost:3000`

---

## Performance Optimizations

- GPS tracking: 5-second interval with 10m distance threshold
- Dashboard: 5-second data refresh interval
- WebSocket: Real-time updates without polling
- SQLite: Lightweight local storage
- Stateless API: Scalable backend design

---

## Security Considerations

- Add authentication before production
- Validate all API inputs
- Use HTTPS/WSS in production
- Implement rate limiting
- Encrypt sensitive data
- Add role-based access control
