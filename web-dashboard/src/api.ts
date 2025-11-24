import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_BASE });

export const fleetAPI = {
  getVehicles: () => api.get('/vehicles'),
  getDrivers: () => api.get('/drivers'),
  getTrips: () => api.get('/trips'),
  getGPSHistory: (tripId: string) => api.get(`/gps/${tripId}`),
};

export const wsAPI = {
  connect: (tripId: string, onLocation: (data: any) => void) => {
    const wsUrl = (process.env.REACT_APP_WS_URL || 'ws://localhost:3000').replace('http', 'ws');
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', tripId }));
    };
    
    ws.onmessage = (event) => {
      onLocation(JSON.parse(event.data));
    };
    
    return ws;
  },
};
