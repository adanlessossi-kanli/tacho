import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { wsAPI, fleetAPI } from '../api';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface LiveMapProps {
  tripId: string;
}

export default function LiveMap({ tripId }: LiveMapProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fleetAPI.getGPSHistory(tripId);
        setLocations(res.data);
        if (res.data.length > 0) {
          setCurrentLocation(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error('Failed to load GPS history:', err);
      }
    };

    loadHistory();

    const ws = wsAPI.connect(tripId, (location: Location) => {
      setLocations((prev) => [...prev, location]);
      setCurrentLocation(location);
    });

    return () => {
      ws.close();
    };
  }, [tripId]);

  const center: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [0, 0];

  const polylinePositions = locations.map((loc) => [loc.latitude, loc.longitude] as [number, number]);

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {polylinePositions.length > 0 && <Polyline positions={polylinePositions} color="blue" />}
      {currentLocation && (
        <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
          <Popup>Current Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
