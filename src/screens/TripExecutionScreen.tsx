import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { tripAPI, routeAPI } from '../services/api';
import { startGPSTracking, stopGPSTracking } from '../services/gps';
import type { Trip, Stop } from '../types';

export default function TripExecutionScreen({ route }: any) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrip = async () => {
    try {
      const res = await tripAPI.get(tripId);
      setTrip(res.data);
      if (res.data.routeId) {
        const stopsRes = await routeAPI.getStops(res.data.routeId);
        setStops(stopsRes.data);
      }
    } catch (err) {
      console.error('Failed to load trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTracking = async () => {
    try {
      await startGPSTracking(tripId);
      setTracking(true);
    } catch (err) {
      console.error('Failed to start tracking:', err);
    }
  };

  const handleStopTracking = async () => {
    stopGPSTracking();
    setTracking(false);
  };

  const handleEndTrip = async () => {
    try {
      await tripAPI.end(tripId);
      handleStopTracking();
      if (trip) {
        setTrip({ ...trip, status: 'completed' });
      }
    } catch (err) {
      console.error('Failed to end trip:', err);
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Execution</Text>
        <Text style={styles.status}>{trip?.status.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vehicle ID: {trip?.vehicleId}</Text>
        <Text style={styles.label}>Driver ID: {trip?.driverId}</Text>
        <Text style={styles.label}>
          Started: {new Date(trip?.startTime || '').toLocaleString()}
        </Text>
      </View>

      {stops.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Stops</Text>
          {stops.map((stop) => (
            <View key={stop.id} style={styles.stop}>
              <Text style={styles.stopText}>
                {stop.sequence + 1}. {stop.address}
              </Text>
              <Text style={styles.coordinates}>
                {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {!tracking ? (
          <TouchableOpacity style={styles.button} onPress={handleStartTracking}>
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStopTracking}>
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
        {trip?.status === 'active' && (
          <TouchableOpacity style={[styles.button, styles.endButton]} onPress={handleEndTrip}>
            <Text style={styles.buttonText}>End Trip</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  stop: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  stopText: { fontSize: 14, fontWeight: '500' },
  coordinates: { fontSize: 12, color: '#999', marginTop: 4 },
  actions: { gap: 12, marginTop: 20 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  stopButton: { backgroundColor: '#FF9500' },
  endButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
