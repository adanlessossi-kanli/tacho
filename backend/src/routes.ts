import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from './database';

const router = Router();

// Vehicles
router.post('/vehicles', (req, res) => {
  const { name, licensePlate } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO vehicles (id, name, licensePlate) VALUES (?, ?, ?)',
    [id, name, licensePlate],
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ id, name, licensePlate, status: 'active' });
    }
  );
});

router.get('/vehicles', (req, res) => {
  db.all('SELECT * FROM vehicles', (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/vehicles/:id', (req, res) => {
  db.get('SELECT * FROM vehicles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(row);
  });
});

// Drivers
router.post('/drivers', (req, res) => {
  const { name, email, phone } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO drivers (id, name, email, phone) VALUES (?, ?, ?, ?)',
    [id, name, email, phone],
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ id, name, email, phone, status: 'active' });
    }
  );
});

router.get('/drivers', (req, res) => {
  db.all('SELECT * FROM drivers', (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

// Routes
router.post('/routes', (req, res) => {
  const { name, description, stops } = req.body;
  const routeId = uuidv4();
  db.run(
    'INSERT INTO routes (id, name, description) VALUES (?, ?, ?)',
    [routeId, name, description],
    (err) => {
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

router.get('/routes', (req, res) => {
  db.all('SELECT * FROM routes', (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/routes/:id/stops', (req, res) => {
  db.all('SELECT * FROM stops WHERE routeId = ? ORDER BY sequence', [req.params.id], (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

// Trips
router.post('/trips', (req, res) => {
  const { vehicleId, driverId, routeId } = req.body;
  const id = uuidv4();
  const startTime = new Date().toISOString();
  db.run(
    'INSERT INTO trips (id, vehicleId, driverId, routeId, startTime, status) VALUES (?, ?, ?, ?, ?, ?)',
    [id, vehicleId, driverId, routeId, startTime, 'active'],
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ id, vehicleId, driverId, routeId, startTime, status: 'active' });
    }
  );
});

router.get('/trips', (req, res) => {
  db.all('SELECT * FROM trips', (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

router.get('/trips/:id', (req, res) => {
  db.get('SELECT * FROM trips WHERE id = ?', [req.params.id], (err, row) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(row);
  });
});

router.put('/trips/:id/end', (req, res) => {
  const endTime = new Date().toISOString();
  db.run(
    'UPDATE trips SET endTime = ?, status = ? WHERE id = ?',
    [endTime, 'completed', req.params.id],
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ success: true });
    }
  );
});

// GPS Locations
router.post('/gps', (req, res) => {
  const { tripId, latitude, longitude } = req.body;
  const id = uuidv4();
  db.run(
    'INSERT INTO gpsLocations (id, tripId, latitude, longitude) VALUES (?, ?, ?, ?)',
    [id, tripId, latitude, longitude],
    (err) => {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ id, tripId, latitude, longitude });
    }
  );
});

router.get('/gps/:tripId', (req, res) => {
  db.all('SELECT * FROM gpsLocations WHERE tripId = ? ORDER BY timestamp', [req.params.tripId], (err, rows) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json(rows);
  });
});

export default router;
