import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { generateToken, verifyToken, authMiddleware, roleMiddleware } from './auth';
import { calculateDistance, calculateTotalDistance, estimateETA, isWithinGeofence, detectGeofenceEvents } from './geospatial';
import { sendPushNotification, sendGeofenceAlert, sendTripAlert } from './notifications';
import { generateDailyReport, generateAnalytics, getReports } from './jobs';

const router = Router();

// Auth endpoints
router.post('/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const token = generateToken({ userId: uuidv4(), email, role: role || 'driver' });
  res.json({ token, user: { email, role } });
});

router.post('/auth/verify', (req, res) => {
  const { token } = req.body;
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  res.json({ valid: true, user: payload });
});

// Vehicles
router.post('/vehicles', authMiddleware, (req, res) => {
  const { name, licensePlate } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO vehicles (id, name, licensePlate) VALUES (?, ?, ?)',
    [id, name, licensePlate],
    (err: any) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        sendPushNotification((req as any).user.userId, 'Vehicle Added', `${name} has been registered`);
        res.json({ id, name, licensePlate, status: 'active' });
      }
    }
  );
});

router.get('/vehicles', authMiddleware, (req, res) => {
  db.all('SELECT * FROM vehicles', (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/vehicles/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM vehicles WHERE id = ?', [req.params.id], (err: any, row: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(row);
  });
});

// Drivers
router.post('/drivers', authMiddleware, (req, res) => {
  const { name, email, phone } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO drivers (id, name, email, phone) VALUES (?, ?, ?, ?)',
    [id, name, email, phone],
    (err: any) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        sendPushNotification((req as any).user.userId, 'Driver Added', `${name} has been registered`);
        res.json({ id, name, email, phone, status: 'active' });
      }
    }
  );
});

router.get('/drivers', authMiddleware, (req, res) => {
  db.all('SELECT * FROM drivers', (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

// Routes
router.post('/routes', authMiddleware, (req, res) => {
  const { name, description, stops } = req.body;
  const routeId = uuidv4();
  db.run(
    'INSERT INTO routes (id, name, description) VALUES (?, ?, ?)',
    [routeId, name, description],
    (err: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (stops && stops.length > 0) {
        stops.forEach((stop: any, idx: number) => {
          const stopId = uuidv4();
          db.run(
            'INSERT INTO stops (id, routeId, latitude, longitude, address, sequence) VALUES (?, ?, ?, ?, ?, ?)',
            [stopId, routeId, stop.latitude, stop.longitude, stop.address, idx]
          );
        });
      }
      res.json({ id: routeId, name, description, stops });
    }
  );
});

router.get('/routes', authMiddleware, (req, res) => {
  db.all('SELECT * FROM routes', (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/routes/:id/stops', authMiddleware, (req, res) => {
  db.all('SELECT * FROM stops WHERE routeId = ? ORDER BY sequence', [req.params.id], (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

// Trips
router.post('/trips', authMiddleware, (req, res) => {
  const { vehicleId, driverId, routeId } = req.body;
  const id = uuidv4();
  const startTime = new Date().toISOString();
  db.run(
    'INSERT INTO trips (id, vehicleId, driverId, routeId, startTime, status) VALUES (?, ?, ?, ?, ?, ?)',
    [id, vehicleId, driverId, routeId, startTime, 'active'],
    (err: any) => {
      if (err) res.status(400).json({ error: err.message });
      else {
        sendTripAlert(driverId, id, 'started');
        res.json({ id, vehicleId, driverId, routeId, startTime, status: 'active' });
      }
    }
  );
});

router.get('/trips', authMiddleware, (req, res) => {
  db.all('SELECT * FROM trips', (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/trips/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM trips WHERE id = ?', [req.params.id], (err: any, row: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(row);
  });
});

router.put('/trips/:id/end', authMiddleware, (req, res) => {
  const tripId = req.params.id;
  const endTime = new Date().toISOString();

  db.get('SELECT * FROM trips WHERE id = ?', [tripId], (err: any, trip: any) => {
    if (err || !trip) {
      return res.status(400).json({ error: 'Trip not found' });
    }

    db.all('SELECT * FROM gpsLocations WHERE tripId = ? ORDER BY timestamp', [tripId], (err: any, locations: any) => {
      const distance = locations && locations.length > 1 ? calculateTotalDistance(locations) : 0;

      db.run(
        'UPDATE trips SET endTime = ?, status = ?, distance = ? WHERE id = ?',
        [endTime, 'completed', distance, tripId],
        (err: any) => {
          if (err) res.status(400).json({ error: err.message });
          else {
            sendTripAlert(trip.driverId, tripId, 'completed');
            res.json({ success: true, distance });
          }
        }
      );
    });
  });
});

// GPS Locations
router.post('/gps', authMiddleware, (req, res) => {
  const { tripId, latitude, longitude } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO gpsLocations (id, tripId, latitude, longitude) VALUES (?, ?, ?, ?)',
    [id, tripId, latitude, longitude],
    (err: any) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ id, tripId, latitude, longitude });
    }
  );
});

router.get('/gps/:tripId', authMiddleware, (req, res) => {
  db.all('SELECT * FROM gpsLocations WHERE tripId = ? ORDER BY timestamp', [req.params.tripId], (err: any, rows: any) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

// Geospatial endpoints
router.post('/geospatial/distance', authMiddleware, (req, res) => {
  const { loc1, loc2 } = req.body;
  const distance = calculateDistance(loc1, loc2);
  res.json({ distance });
});

router.post('/geospatial/eta', authMiddleware, (req, res) => {
  const { currentLoc, destination, avgSpeed } = req.body;
  const eta = estimateETA(currentLoc, destination, avgSpeed);
  res.json({ eta });
});

router.post('/geospatial/geofence-check', authMiddleware, (req, res) => {
  const { location, geofence } = req.body;
  const isInside = isWithinGeofence(location, geofence);
  res.json({ isInside });
});

// Reports and Analytics
router.get('/reports', authMiddleware, roleMiddleware(['manager', 'admin']), (req, res) => {
  const reports = getReports();
  res.json(reports);
});

router.post('/reports/generate', authMiddleware, roleMiddleware(['manager', 'admin']), (req, res) => {
  const report = generateDailyReport();
  res.json(report);
});

router.get('/analytics', authMiddleware, roleMiddleware(['manager', 'admin']), (req, res) => {
  const analytics = generateAnalytics();
  res.json(analytics);
});

export default router;
