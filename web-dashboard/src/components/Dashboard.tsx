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
  endTime?: string;
  distance?: number;
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'reports'>('monitor');

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
      setVehicles(vehiclesRes.data || []);
      setDrivers(driversRes.data || []);
      setTrips(tripsRes.data || []);
      if (!selectedTrip && tripsRes.data?.length > 0) {
        setSelectedTrip(tripsRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeTrips = trips.filter((t) => t.status === 'active');
  const completedTrips = trips.filter((t) => t.status === 'completed');
  const activeVehicles = vehicles.filter((v) => v.status === 'active');

  const totalDistance = trips.reduce((sum, t) => sum + (t.distance || 0), 0);
  const avgDistance = completedTrips.length > 0 ? (totalDistance / completedTrips.length).toFixed(2) : '0';

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalVehicles: vehicles.length,
        activeVehicles: activeVehicles.length,
        totalDrivers: drivers.length,
        activeTrips: activeTrips.length,
        completedTrips: completedTrips.length,
        totalDistance: totalDistance.toFixed(2),
        averageDistance: avgDistance,
      },
      trips: trips.map((t) => ({
        id: t.id,
        vehicle: vehicles.find((v) => v.id === t.vehicleId)?.name,
        driver: drivers.find((d) => d.id === t.driverId)?.name,
        status: t.status,
        startTime: t.startTime,
        endTime: t.endTime,
        distance: t.distance,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-report-${new Date().getTime()}.json`;
    a.click();
  };

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Fleet Management Dashboard</h1>
        <div className="header-actions">
          <button className={`tab-btn ${activeTab === 'monitor' ? 'active' : ''}`} onClick={() => setActiveTab('monitor')}>
            Monitor
          </button>
          <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            Reports
          </button>
          <button className="export-btn" onClick={exportReport}>
            📥 Export Report
          </button>
        </div>
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
          <div className="stat-card">
            <h3>{completedTrips.length}</h3>
            <p>Completed Trips</p>
          </div>
        </div>

        {activeTab === 'monitor' && (
          <div className="main-content">
            <div className="map-container">
              {selectedTrip && <LiveMap tripId={selectedTrip} />}
            </div>

            <div className="sidebar">
              <div className="trips-list">
                <h3>Active Trips ({activeTrips.length})</h3>
                {activeTrips.length === 0 ? (
                  <p className="empty-state">No active trips</p>
                ) : (
                  activeTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className={`trip-item ${selectedTrip === trip.id ? 'active' : ''}`}
                      onClick={() => setSelectedTrip(trip.id)}
                    >
                      <div className="trip-info">
                        <p className="trip-id">Trip {trip.id.slice(0, 8)}</p>
                        <p className="trip-vehicle">{vehicles.find((v) => v.id === trip.vehicleId)?.name}</p>
                        <p className="trip-driver">{drivers.find((d) => d.id === trip.driverId)?.name}</p>
                        <p className="trip-time">{new Date(trip.startTime).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="vehicles-list">
                <h3>Vehicles ({vehicles.length})</h3>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="vehicle-item">
                    <p className="vehicle-name">{vehicle.name}</p>
                    <p className="vehicle-plate">{vehicle.licensePlate}</p>
                    <span className={`status-badge ${vehicle.status}`}>{vehicle.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-container">
            <div className="report-section">
              <h2>Fleet Summary</h2>
              <div className="report-grid">
                <div className="report-item">
                  <label>Total Vehicles</label>
                  <p>{vehicles.length}</p>
                </div>
                <div className="report-item">
                  <label>Active Vehicles</label>
                  <p>{activeVehicles.length}</p>
                </div>
                <div className="report-item">
                  <label>Total Drivers</label>
                  <p>{drivers.length}</p>
                </div>
                <div className="report-item">
                  <label>Active Trips</label>
                  <p>{activeTrips.length}</p>
                </div>
                <div className="report-item">
                  <label>Completed Trips</label>
                  <p>{completedTrips.length}</p>
                </div>
                <div className="report-item">
                  <label>Total Distance</label>
                  <p>{totalDistance.toFixed(2)} km</p>
                </div>
                <div className="report-item">
                  <label>Average Distance</label>
                  <p>{avgDistance} km</p>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h2>Trip History</h2>
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.id.slice(0, 8)}</td>
                      <td>{vehicles.find((v) => v.id === trip.vehicleId)?.name}</td>
                      <td>{drivers.find((d) => d.id === trip.driverId)?.name}</td>
                      <td><span className={`status-badge ${trip.status}`}>{trip.status}</span></td>
                      <td>{new Date(trip.startTime).toLocaleString()}</td>
                      <td>{trip.endTime ? new Date(trip.endTime).toLocaleString() : '-'}</td>
                      <td>{trip.distance ? trip.distance.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
