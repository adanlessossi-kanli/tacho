# Backend Services Documentation

## Overview

The Tacho backend implements 6 core services:

1. **REST API Server** - CRUD operations for all fleet entities
2. **WebSocket Server** - Real-time GPS tracking
3. **Authentication Service** - JWT tokens and role-based access
4. **Geospatial Service** - Distance calculations, ETAs, geofencing
5. **Notification Service** - Push notifications and SMS alerts
6. **Background Jobs** - Reports, analytics, scheduled tasks

---

## 1. REST API Server

### Purpose
Handles all CRUD operations for vehicles, drivers, routes, trips, and GPS data.

### Endpoints

#### Vehicles
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details

#### Drivers
- `POST /api/drivers` - Register driver
- `GET /api/drivers` - List all drivers

#### Routes
- `POST /api/routes` - Create route with stops
- `GET /api/routes` - List all routes
- `GET /api/routes/:id/stops` - Get route stops

#### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - List all trips
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id/end` - End trip (calculates distance)

#### GPS
- `POST /api/gps` - Record GPS location
- `GET /api/gps/:tripId` - Get GPS history

### Features
- All endpoints require authentication
- Automatic distance calculation on trip end
- Notification triggers on vehicle/driver registration
- Notification triggers on trip start/completion

### File
`src/routes.ts`

---

## 2. WebSocket Server

### Purpose
Manages real-time connections for live vehicle tracking.

### Protocol

**Subscribe to trip updates:**
```json
{
  "type": "subscribe",
  "tripId": "trip-id-here"
}
```

**Send location update:**
```json
{
  "type": "location",
  "tripId": "trip-id-here",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Receive location broadcast:**
```json
{
  "tripId": "trip-id-here",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Features
- Per-trip subscription model
- Automatic cleanup on disconnect
- Real-time broadcasting to all subscribers
- Timestamp included in updates

### File
`src/websocket.ts`

---

## 3. Authentication Service

### Purpose
Handles user login, JWT token generation, and role-based access control.

### Endpoints

**Login:**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password",
  "role": "driver" | "manager" | "admin"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "user@example.com",
    "role": "driver"
  }
}
```

**Verify Token:**
```bash
POST /api/auth/verify
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Features
- JWT token generation (24-hour expiry)
- Token verification
- Role-based middleware
- Automatic token validation on protected endpoints

### Roles
- `driver` - Can create/execute trips, send GPS
- `manager` - Can view reports, analytics
- `admin` - Full access

### Usage

**Protect endpoint:**
```typescript
router.get('/endpoint', authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});
```

**Protect by role:**
```typescript
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Admin only' });
});
```

### File
`src/auth.ts`

---

## 4. Geospatial Service

### Purpose
Processes location data, calculates distances, ETAs, and geofencing.

### Functions

**Calculate Distance:**
```typescript
const distance = calculateDistance(
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7580, longitude: -73.9855 }
);
// Returns distance in kilometers
```

**Calculate Total Distance:**
```typescript
const locations = [
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7580, longitude: -73.9855 },
  { latitude: 40.7489, longitude: -73.9680 }
];
const totalDistance = calculateTotalDistance(locations);
```

**Estimate ETA:**
```typescript
const eta = estimateETA(
  { latitude: 40.7128, longitude: -74.0060 },
  { latitude: 40.7580, longitude: -73.9855 },
  50 // average speed in km/h
);
// Returns minutes
```

**Check Geofence:**
```typescript
const isInside = isWithinGeofence(
  { latitude: 40.7128, longitude: -74.0060 },
  {
    latitude: 40.7128,
    longitude: -74.0060,
    radiusKm: 1
  }
);
```

**Detect Geofence Events:**
```typescript
const event = detectGeofenceEvents(
  prevLocation,
  currentLocation,
  geofence
);
// Returns 'enter', 'exit', or null
```

### Algorithms
- Haversine formula for distance calculation
- Simple speed-based ETA estimation
- Circular geofence detection

### Endpoints
- `POST /api/geospatial/distance` - Calculate distance
- `POST /api/geospatial/eta` - Estimate ETA
- `POST /api/geospatial/geofence-check` - Check geofence

### File
`src/geospatial.ts`

---

## 5. Notification Service

### Purpose
Sends push notifications and SMS alerts.

### Functions

**Send Notification:**
```typescript
sendNotification({
  userId: 'user-id',
  title: 'Trip Started',
  message: 'Your trip has started',
  type: 'alert',
  data: { tripId: 'trip-id' }
});
```

**Send SMS:**
```typescript
sendSMS('+1234567890', 'Your trip has started');
```

**Send Push Notification:**
```typescript
sendPushNotification(
  'user-id',
  'Trip Started',
  'Your trip has started'
);
```

**Send Geofence Alert:**
```typescript
sendGeofenceAlert('user-id', 'Warehouse', 'enter');
// Sends: "Vehicle entered Warehouse"
```

**Send Trip Alert:**
```typescript
sendTripAlert('driver-id', 'trip-id', 'completed');
// Sends: "Trip has been completed"
```

### Features
- In-memory notification queue
- SMS placeholder (integrate Twilio/AWS SNS)
- Geofence event alerts
- Trip status alerts
- Notification types: alert, info, warning

### Integration Points
- Vehicle registration
- Driver registration
- Trip start/completion
- Geofence entry/exit

### File
`src/notifications.ts`

---

## 6. Background Jobs

### Purpose
Generates reports, analytics, and runs scheduled tasks.

### Jobs

**Daily Report:**
- Runs at 00:00 every day
- Counts trips, distance, vehicles used
- Stores in report queue

**Weekly Report:**
- Runs every Monday at 00:00
- Aggregates 7-day metrics
- Stores in report queue

**Analytics:**
- Runs every hour
- Calculates total vehicles, drivers, trips
- Calculates average distance
- Stores in analytics

### Endpoints
- `GET /api/reports` - Get all reports (manager/admin only)
- `POST /api/reports/generate` - Generate report (manager/admin only)
- `GET /api/analytics` - Get analytics (manager/admin only)

### Functions

**Generate Daily Report:**
```typescript
const report = generateDailyReport();
// Returns: { id, type: 'daily', generatedAt, data }
```

**Generate Analytics:**
```typescript
const analytics = generateAnalytics();
// Returns: { totalVehicles, totalDrivers, completedTrips, avgDistance }
```

**Schedule Jobs:**
```typescript
scheduleJobs();
// Starts all background jobs
```

### Report Structure
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

### File
`src/jobs.ts`

---

## Configuration

### Environment Variables

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

### JWT Secret
- Default: `your-secret-key-change-in-production`
- Change in production!
- Set via `JWT_SECRET` environment variable

---

## Security Considerations

### Current Implementation
- JWT token-based authentication
- Role-based access control
- 24-hour token expiry
- Protected endpoints

### Production Recommendations
- [ ] Use HTTPS/TLS
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Use environment variables for secrets
- [ ] Add audit logging
- [ ] Implement refresh tokens
- [ ] Add CORS restrictions
- [ ] Use secure password hashing
- [ ] Implement API key rotation
- [ ] Add request signing

---

## Performance Considerations

- Distance calculations use Haversine formula (O(1))
- Geofence checks are O(1)
- ETA estimation is O(1)
- Background jobs run on intervals
- Notifications use in-memory queue
- WebSocket broadcasts to subscribers only

---

## Files

- `src/index.ts` - Main server
- `src/routes.ts` - API endpoints
- `src/websocket.ts` - WebSocket server
- `src/auth.ts` - Authentication
- `src/geospatial.ts` - Geospatial calculations
- `src/notifications.ts` - Notifications
- `src/jobs.ts` - Background jobs
- `src/database.ts` - Database schema
