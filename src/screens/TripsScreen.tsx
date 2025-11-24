import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { tripAPI, vehicleAPI, driverAPI } from '../services/api';
import type { Trip, Vehicle, Driver } from '../types';

export default function TripsScreen({ navigation }: any) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Map<string, Vehicle>>(new Map());
  const [drivers, setDrivers] = useState<Map<string, Driver>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        tripAPI.list(),
        vehicleAPI.list(),
        driverAPI.list(),
      ]);
      setTrips(tripsRes.data);
      setVehicles(new Map(vehiclesRes.data.map((v) => [v.id, v])));
      setDrivers(new Map(driversRes.data.map((d) => [d.id, d])));
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async () => {
    const vehicleId = Array.from(vehicles.keys())[0];
    const driverId = Array.from(drivers.keys())[0];
    if (!vehicleId || !driverId) {
      alert('Please register a vehicle and driver first');
      return;
    }
    try {
      const res = await tripAPI.create({ vehicleId, driverId });
      setTrips([...trips, res.data]);
    } catch (err) {
      console.error('Failed to create trip:', err);
    }
  };

  const renderTrip = ({ item }: { item: Trip }): React.ReactElement => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('TripExecution', { tripId: item.id })}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripStatus}>{item.status.toUpperCase()}</Text>
        <Text style={styles.tripTime}>{new Date(item.startTime).toLocaleTimeString()}</Text>
      </View>
      <Text style={styles.tripInfo}>
        Vehicle: {vehicles.get(item.vehicleId)?.name || item.vehicleId}
      </Text>
      <Text style={styles.tripInfo}>
        Driver: {drivers.get(item.driverId)?.name || item.driverId}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip}>
        <Text style={styles.createButtonText}>+ New Trip</Text>
      </TouchableOpacity>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  createButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  tripCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tripStatus: { fontSize: 12, fontWeight: 'bold', color: '#007AFF' },
  tripTime: { fontSize: 12, color: '#999' },
  tripInfo: { fontSize: 14, marginBottom: 4 },
});
