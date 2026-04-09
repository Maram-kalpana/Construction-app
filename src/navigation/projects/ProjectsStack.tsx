import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AddExpenseScreen } from '../../screens/accounts/AddExpenseScreen';
import { AccountsDashboardScreen } from '../../screens/accounts/AccountsDashboardScreen';
import { ExpenseDetailsScreen } from '../../screens/accounts/ExpenseDetailsScreen';
import { ExpenseListScreen } from '../../screens/accounts/ExpenseListScreen';
import { ProjectDetailsScreen } from '../../screens/projects/ProjectDetailsScreen';
import { ProjectsScreen } from '../../screens/projects/ProjectsScreen';
import type { ProjectsStackParamList } from '../types';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export function ProjectsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0b1213' },
        headerTintColor: '#e9f2f2',
        contentStyle: { backgroundColor: '#071012' },
      }}
    >
      <Stack.Screen name="ProjectsHome" component={ProjectsScreen} options={{ title: 'Projects' }} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} options={{ title: 'Project Details' }} />

      <Stack.Screen name="Accounts" component={AccountsDashboardScreen} options={{ title: 'Accounts' }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expenses' }} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Expense Details' }} />
    </Stack.Navigator>
  );
}

