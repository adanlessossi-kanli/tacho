import * as Location from 'expo-location';
import { gpsAPI } from './api';

let locationSubscription: Location.LocationSubscription | null = null;

export async function startGPSTracking(tripId: string, interval: number = 5000) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: interval,
      distanceInterval: 10,
    },
    async (location) => {
      try {
        await gpsAPI.track(tripId, location.coords.latitude, location.coords.longitude);
      } catch (err) {
        console.error('GPS tracking error:', err);
      }
    }
  );
}

export function stopGPSTracking() {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
}
