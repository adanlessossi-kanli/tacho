import axios from 'axios';
import type { Vehicle, Driver, Route, Trip, GPSLocation, Stop } from '../types';

const API_BASE =
  typeof process !== 'undefined' && process.env?.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_BASE });

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
    api.post<GPSLocation>('/gps', { tripId, latitude, longitude }),
  getHistory: (tripId: string) => api.get<GPSLocation[]>(`/gps/${tripId}`),
};
