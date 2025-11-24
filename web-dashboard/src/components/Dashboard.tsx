import React, { useEffect, useState } from 'react';
import { fleetAPI } from '../api';
import LiveMap from './LiveMap';
import './Dashboard.css';

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  status: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  status: string;
  startTime: string;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
        fleetAPI.getVehicles(),
        fleetAPI.getDrivers(),
        fleetAPI.getTrips(),
      ]);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
      setTrips(tripsRes.data);
      if (!selectedTrip && tripsRes.data.length > 0) {
        setSelectedTrip(tripsRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeTrips = trips.filter((t) => t.status === 'active');
  const activeVehicles = vehicles.filter((v) => v.status === 'active');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Fleet Management Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-card">
            <h3>{activeVehicles.length}</h3>
            <p>Active Vehicles</p>
          </div>
          <div className="stat-card">
            <h3>{drivers.length}</h3>
            <p>Total Drivers</p>
          </div>
          <div className="stat-card">
            <h3>{activeTrips.length}</h3>
            <p>Active Trips</p>
          </div>
        </div>

        <div className="main-content">
          <div className="map-container">
            {selectedTrip && <LiveMap tripId={selectedTrip} />}
          </div>

          <div className="sidebar">
            <div className="trips-list">
              <h3>Active Trips</h3>
              {activeTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`trip-item ${selectedTrip === trip.id ? 'active' : ''}`}
                  onClick={() => setSelectedTrip(trip.id)}
                >
                  <div className="trip-info">
                    <p className="trip-id">Trip {trip.id.slice(0, 8)}</p>
                    <p className="trip-time">{new Date(trip.startTime).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="vehicles-list">
              <h3>Vehicles</h3>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-item">
                  <p className="vehicle-name">{vehicle.name}</p>
                  <p className="vehicle-plate">{vehicle.licensePlate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
