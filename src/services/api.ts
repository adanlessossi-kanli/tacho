import axios from 'axios';
import { API_CONFIG } from '../config';
import type { Vehicle, Driver, Route, Trip, GPSLocation, Stop } from '../types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const vehicleAPI = {
  list: () => api.get<Vehicle[]>('/vehicles'),
  get: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (data: Omit<Vehicle, 'id' | 'status'>) => api.post<Vehicle>('/vehicles', data),
};

export const driverAPI = {
  list: () => api.get<Driver[]>('/drivers'),
  create: (data: Omit<Driver, 'id' | 'status'>) => api.post<Driver>('/drivers', data),
};

export const routeAPI = {
  list: () => api.get<Route[]>('/routes'),
  create: (data: Omit<Route, 'id'>) => api.post<Route>('/routes', data),
  getStops: (routeId: string) => api.get<Stop[]>(`/routes/${routeId}/stops`),
};

export const tripAPI = {
  list: () => api.get<Trip[]>('/trips'),
  get: (id: string) => api.get<Trip>(`/trips/${id}`),
  create: (data: Omit<Trip, 'id' | 'startTime' | 'distance' | 'status'>) =>
    api.post<Trip>('/trips', data),
  end: (id: string) => api.put(`/trips/${id}/end`),
};

export const gpsAPI = {
  track: (tripId: string, latitude: number, longitude: number) =>
    api.post<GPSLocation>('/gps', { tripId, latitude, longitude }).catch((err) => {
      console.error('GPS track error:', err);
      return { data: { id: '', tripId, latitude, longitude, timestamp: new Date().toISOString() } };
    }),
  getHistory: (tripId: string) => api.get<GPSLocation[]>(`/gps/${tripId}`),
};

export default api;
