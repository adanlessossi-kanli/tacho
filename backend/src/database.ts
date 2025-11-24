import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../fleet.db');
const db = new sqlite3.Database(dbPath);

export function initializeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        licensePlate TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS drivers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        status TEXT DEFAULT 'active',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS stops (
        id TEXT PRIMARY KEY,
        routeId TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT,
        sequence INTEGER,
        FOREIGN KEY(routeId) REFERENCES routes(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        vehicleId TEXT NOT NULL,
        driverId TEXT NOT NULL,
        routeId TEXT,
        startTime DATETIME NOT NULL,
        endTime DATETIME,
        distance REAL DEFAULT 0,
        status TEXT DEFAULT 'scheduled',
        FOREIGN KEY(vehicleId) REFERENCES vehicles(id),
        FOREIGN KEY(driverId) REFERENCES drivers(id),
        FOREIGN KEY(routeId) REFERENCES routes(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS gpsLocations (
        id TEXT PRIMARY KEY,
        tripId TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(tripId) REFERENCES trips(id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export default db;
