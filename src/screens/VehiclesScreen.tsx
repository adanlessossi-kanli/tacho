import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { vehicleAPI } from '../services/api';
import type { Vehicle } from '../types';

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await vehicleAPI.list();
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!name || !licensePlate) {
      alert('Please fill all fields');
      return;
    }
    try {
      const res = await vehicleAPI.create({ name, licensePlate, status: 'active' });
      setVehicles([...vehicles, res.data]);
      setName('');
      setLicensePlate('');
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  const renderVehicle = ({ item }: { item: Vehicle }): React.ReactElement => (
    <View style={styles.vehicleCard}>
      <Text style={styles.vehicleName}>{item.name}</Text>
      <Text style={styles.vehicleInfo}>License: {item.licensePlate}</Text>
      <Text style={styles.vehicleStatus}>{item.status}</Text>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Truck 001"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>License Plate</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., ABC-1234"
          value={licensePlate}
          onChangeText={setLicensePlate}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddVehicle}>
          <Text style={styles.buttonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { padding: 16 },
  vehicleCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  vehicleName: { fontSize: 16, fontWeight: 'bold' },
  vehicleInfo: { fontSize: 14, color: '#666', marginTop: 4 },
  vehicleStatus: { fontSize: 12, color: '#999', marginTop: 4 },
});
