import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import DriversScreen from '../screens/DriversScreen';
import TripsScreen from '../screens/TripsScreen';
import TripExecutionScreen from '../screens/TripExecutionScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TripsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TripsList" component={TripsScreen} options={{ title: 'Trips' }} />
      <Stack.Screen
        name="TripExecution"
        component={TripExecutionScreen}
        options={{ title: 'Execute Trip' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Vehicles" component={VehiclesScreen} />
      <Tab.Screen name="Drivers" component={DriversScreen} />
      <Tab.Screen name="Trips" component={TripsStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
