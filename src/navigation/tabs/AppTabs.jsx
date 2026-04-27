import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { ProfileScreen } from '../../screens/profile/ProfileScreen';
import { SettingsScreen } from '../../screens/settings/SettingsScreen';
import { HomeStack } from '../home/HomeStack';

const Tab = createBottomTabNavigator();

// ── Reusable logo component for header right ──
const HeaderLogo = () => (
  <Image
    source={require('../../../assets/sruthika_final_logo.png')}
    style={styles.headerLogo}
    resizeMode="contain"
  />
);

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
  backgroundColor: '#fff',          // ✅ white bottom bar
  borderTopColor: '#e5e7eb',        // light border
  height: 62,
  paddingBottom: 8,
  paddingTop: 8,
},
        tabBarActiveTintColor: '#2563eb',   // blue active
tabBarInactiveTintColor: '#9ca3af', // gray inactive
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-variant" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#0b1213' },
          headerTintColor: '#e9f2f2',
          title: 'Profile',
          headerRight: () => <HeaderLogo />,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#0b1213' },
          headerTintColor: '#e9f2f2',
          title: 'Settings',
          headerRight: () => <HeaderLogo />,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    width: 72,
    height: 36,
    marginRight: 4,
  },
});