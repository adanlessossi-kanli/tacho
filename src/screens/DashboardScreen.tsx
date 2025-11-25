import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { vehicleAPI, driverAPI, tripAPI } from '../services/api';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, trips: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
        vehicleAPI.list(),
        driverAPI.list(),
        tripAPI.list(),
      ]);
      setStats({
        vehicles: vehiclesRes.data?.length || 0,
        drivers: driversRes.data?.length || 0,
        trips: tripsRes.data?.filter((t: any) => t.status === 'active').length || 0,
      });
    } catch (err: any) {
      console.error('Failed to load stats:', err);
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: {error}\n\nMake sure backend is running on 192.168.1.100:3000
        </Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fleet Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.vehicles}</Text>
          <Text style={styles.statLabel}>Vehicles</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.drivers}</Text>
          <Text style={styles.statLabel}>Drivers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.trips}</Text>
          <Text style={styles.statLabel}>Active Trips</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  errorText: { fontSize: 14, color: '#d32f2f', textAlign: 'center' },
  header: { padding: 16, backgroundColor: '#2c3e50' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  statCard: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 8 },
});
