export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Stop {
  id: string;
  routeId: string;
  latitude: number;
  longitude: number;
  address: string;
  sequence: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  stops?: Stop[];
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  routeId?: string;
  startTime: string;
  endTime?: string;
  distance: number;
  status: 'scheduled' | 'active' | 'completed';
}

export interface GPSLocation {
  id: string;
  tripId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}
