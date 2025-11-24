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
import { driverAPI } from '../services/api';
import type { Driver } from '../types';

export default function DriversScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const res = await driverAPI.list();
      setDrivers(res.data);
    } catch (err) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    if (!name || !email) {
      alert('Please fill required fields');
      return;
    }
    try {
      const res = await driverAPI.create({ name, email, phone, status: 'active' });
      setDrivers([...drivers, res.data]);
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error('Failed to add driver:', err);
    }
  };

  const renderDriver = ({ item }: { item: Driver }): React.ReactElement => (
    <View style={styles.driverCard}>
      <Text style={styles.driverName}>{item.name}</Text>
      <Text style={styles.driverInfo}>Email: {item.email}</Text>
      <Text style={styles.driverInfo}>Phone: {item.phone}</Text>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Driver Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddDriver}>
          <Text style={styles.buttonText}>Add Driver</Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={drivers}
        renderItem={renderDriver}
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
  driverCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  driverName: { fontSize: 16, fontWeight: 'bold' },
  driverInfo: { fontSize: 14, color: '#666', marginTop: 4 },
});
