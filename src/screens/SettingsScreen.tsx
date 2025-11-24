import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>API Endpoint</Text>
          <Text style={styles.settingValue}>http://localhost:3000/api</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          Fleet Management System MVP - A comprehensive solution for managing vehicles, drivers,
          routes, and real-time GPS tracking.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  setting: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingValue: { fontSize: 14, color: '#666', marginTop: 4 },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
});
