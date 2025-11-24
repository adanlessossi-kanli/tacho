import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { vehicleAPI, driverAPI, tripAPI } from '../services/api';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, trips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
        vehicleAPI.list(),
        driverAPI.list(),
        tripAPI.list(),
      ]);
      setStats({
        vehicles: vehiclesRes.data.length,
        drivers: driversRes.data.length,
        trips: tripsRes.data.filter((t: any) => t.status === 'active').length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text>Loading...</Text>;

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
