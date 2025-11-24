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

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startTime: Date;
  endTime?: Date;
  distance: number;
}
