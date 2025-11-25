import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { tripAPI, routeAPI } from '../services/api';
import { startGPSTracking, stopGPSTracking } from '../services/gps';
import type { Trip, Stop } from '../types';

interface StopLog {
  stopId: string;
  address: string;
  arrivedAt: string;
  departedAt?: string;
}

export default function TripExecutionScreen({ route }: any) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [stopLogs, setStopLogs] = useState<StopLog[]>([]);
  const [tracking, setTracking] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

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
      Alert.alert('Error', 'Failed to start GPS tracking');
    }
  };

  const handleStopTracking = async () => {
    stopGPSTracking();
    setTracking(false);
  };

  const handleLogStop = () => {
    if (currentStopIndex >= stops.length) {
      Alert.alert('Info', 'All stops completed');
      return;
    }
    const stop = stops[currentStopIndex];
    const log: StopLog = {
      stopId: stop.id,
      address: stop.address,
      arrivedAt: new Date().toISOString(),
    };
    setStopLogs([...stopLogs, log]);
    setCurrentStopIndex(currentStopIndex + 1);
    Alert.alert('Stop Logged', `Arrived at: ${stop.address}`);
  };

  const handleDepartStop = () => {
    if (stopLogs.length === 0) return;
    const lastLog = stopLogs[stopLogs.length - 1];
    if (!lastLog.departedAt) {
      const updated = [...stopLogs];
      updated[updated.length - 1].departedAt = new Date().toISOString();
      setStopLogs(updated);
      Alert.alert('Stop Completed', 'Departed from stop');
    }
  };

  const handleEndTrip = async () => {
    try {
      await tripAPI.end(tripId);
      handleStopTracking();
      if (trip) {
        setTrip({ ...trip, status: 'completed' });
      }
      Alert.alert('Success', 'Trip completed');
    } catch (err) {
      Alert.alert('Error', 'Failed to end trip');
    }
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );

  const currentStop = currentStopIndex < stops.length ? stops[currentStopIndex] : null;
  const lastLog = stopLogs.length > 0 ? stopLogs[stopLogs.length - 1] : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Execution</Text>
        <Text style={[styles.status, { color: trip?.status === 'active' ? '#34C759' : '#FF9500' }]}>
          {trip?.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vehicle: {trip?.vehicleId}</Text>
        <Text style={styles.label}>Driver: {trip?.driverId}</Text>
        <Text style={styles.label}>
          Started: {new Date(trip?.startTime || '').toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GPS Tracking</Text>
        <Text style={styles.trackingStatus}>{tracking ? '🔴 LIVE' : '⚪ STOPPED'}</Text>
        <View style={styles.trackingButtons}>
          {!tracking ? (
            <TouchableOpacity style={styles.button} onPress={handleStartTracking}>
              <Text style={styles.buttonText}>Start Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopTracking}
            >
              <Text style={styles.buttonText}>Stop Tracking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {stops.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Route Stops ({currentStopIndex}/{stops.length})
          </Text>
          {currentStop && (
            <View style={styles.currentStop}>
              <Text style={styles.currentStopLabel}>Current Stop:</Text>
              <Text style={styles.currentStopAddress}>{currentStop.address}</Text>
              <Text style={styles.coordinates}>
                {currentStop.latitude.toFixed(4)}, {currentStop.longitude.toFixed(4)}
              </Text>
              <View style={styles.stopActions}>
                <TouchableOpacity style={styles.logButton} onPress={handleLogStop}>
                  <Text style={styles.buttonText}>Log Arrival</Text>
                </TouchableOpacity>
                {lastLog && !lastLog.departedAt && (
                  <TouchableOpacity
                    style={[styles.logButton, styles.departButton]}
                    onPress={handleDepartStop}
                  >
                    <Text style={styles.buttonText}>Log Departure</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {stopLogs.length > 0 && (
            <View style={styles.stopLogsContainer}>
              <Text style={styles.stopLogsTitle}>Stop History</Text>
              <FlatList
                data={stopLogs}
                renderItem={({ item, index }) => (
                  <View style={styles.stopLog}>
                    <Text style={styles.stopLogIndex}>
                      {index + 1}. {item.address}
                    </Text>
                    <Text style={styles.stopLogTime}>
                      Arrived: {new Date(item.arrivedAt).toLocaleTimeString()}
                    </Text>
                    {item.departedAt && (
                      <Text style={styles.stopLogTime}>
                        Departed: {new Date(item.departedAt).toLocaleTimeString()}
                      </Text>
                    )}
                  </View>
                )}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      )}

      {trip?.status === 'active' && (
        <TouchableOpacity style={[styles.button, styles.endButton]} onPress={handleEndTrip}>
          <Text style={styles.buttonText}>End Trip</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  status: { fontSize: 14, marginTop: 4 },
  section: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  trackingStatus: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  trackingButtons: { gap: 8 },
  currentStop: { backgroundColor: '#f0f4ff', padding: 12, borderRadius: 8, marginBottom: 12 },
  currentStopLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  currentStopAddress: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  coordinates: { fontSize: 12, color: '#999', marginBottom: 12 },
  stopActions: { flexDirection: 'row', gap: 8 },
  stopLogsContainer: { marginTop: 12 },
  stopLogsTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  stopLog: { backgroundColor: '#f9f9f9', padding: 8, borderRadius: 6, marginBottom: 8 },
  stopLogIndex: { fontSize: 13, fontWeight: '600' },
  stopLogTime: { fontSize: 12, color: '#666', marginTop: 2 },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  logButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  departButton: { backgroundColor: '#FF9500' },
  stopButton: { backgroundColor: '#FF9500' },
  endButton: { backgroundColor: '#d32f2f', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
