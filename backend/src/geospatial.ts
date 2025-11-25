export interface Location {
  latitude: number;
  longitude: number;
}

export interface GeofenceConfig {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

// Calculate distance between two points in kilometers using Haversine formula
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total distance from GPS points
export function calculateTotalDistance(locations: Location[]): number {
  if (locations.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    total += calculateDistance(locations[i], locations[i + 1]);
  }
  return total;
}

// Estimate time to arrival (simple: distance / average speed)
export function estimateETA(currentLoc: Location, destination: Location, avgSpeedKmh: number = 50): number {
  const distanceKm = calculateDistance(currentLoc, destination);
  return Math.round((distanceKm / avgSpeedKmh) * 60); // Return minutes
}

// Check if location is within geofence
export function isWithinGeofence(location: Location, geofence: GeofenceConfig): boolean {
  const distance = calculateDistance(location, { latitude: geofence.latitude, longitude: geofence.longitude });
  return distance <= geofence.radiusKm;
}

// Get geofence entry/exit events
export function detectGeofenceEvents(
  prevLocation: Location | null,
  currentLocation: Location,
  geofence: GeofenceConfig
): 'enter' | 'exit' | null {
  if (!prevLocation) return null;
  const wasInside = isWithinGeofence(prevLocation, geofence);
  const isInside = isWithinGeofence(currentLocation, geofence);
  if (!wasInside && isInside) return 'enter';
  if (wasInside && !isInside) return 'exit';
  return null;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
