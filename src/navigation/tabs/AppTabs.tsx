import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DashboardScreen } from '../../screens/dashboard/DashboardScreen';
import { ProjectsStack } from '../projects/ProjectsStack';
import type { AppTabsParamList } from '../types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0b1213', borderTopColor: 'rgba(255,255,255,0.12)' },
        tabBarActiveTintColor: '#42a5f5',
        tabBarInactiveTintColor: 'rgba(233,242,242,0.7)',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="briefcase" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

