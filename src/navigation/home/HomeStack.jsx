import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AccountsDashboardScreen } from '../../screens/accounts/AccountsDashboardScreen';
import { AccountsProjectListScreen } from '../../screens/accounts/AccountsProjectListScreen';
import { AddExpenseScreen } from '../../screens/accounts/AddExpenseScreen';
import { ExpenseDetailsScreen } from '../../screens/accounts/ExpenseDetailsScreen';
import { ExpenseListScreen } from '../../screens/accounts/ExpenseListScreen';
import { HomeDashboardScreen } from '../../screens/home/HomeDashboardScreen';
import { LabourFormScreen } from '../../screens/modules/LabourFormScreen';
import { LabourListScreen } from '../../screens/modules/LabourListScreen';
import { LabourModuleScreen } from '../../screens/modules/LabourModuleScreen';
import { LabourReportFormScreen } from '../../screens/modules/LabourReportFormScreen';
import { MachineFormScreen } from '../../screens/modules/MachineFormScreen';
import { MachineListScreen } from '../../screens/modules/MachineListScreen';
import { MaterialFormScreen } from '../../screens/modules/MaterialFormScreen';
import { MaterialListScreen } from '../../screens/modules/MaterialListScreen';
import { StockModuleScreen } from '../../screens/modules/StockModuleScreen';
import { ProjectModulesScreen } from '../../screens/projects/ProjectModulesScreen';
import { ProjectsListScreen } from '../../screens/projects/ProjectsListScreen';
import { VendorFormScreen } from '../../screens/vendors/VendorFormScreen';
import { VendorsListScreen } from '../../screens/vendors/VendorsListScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#ffffff' },
  headerTintColor: '#17324f',
  contentStyle: { backgroundColor: '#e9f5ff' },
  headerShadowVisible: false,
};

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProjectsList" component={ProjectsListScreen} options={{ title: 'Projects' }} />
      <Stack.Screen name="ProjectModules" component={ProjectModulesScreen} options={{ title: 'Site modules' }} />
      <Stack.Screen name="LabourModule" component={LabourModuleScreen} options={{ title: 'Labour' }} />
      <Stack.Screen name="LabourList" component={LabourListScreen} options={{ title: "Today's labour" }} />
      <Stack.Screen name="LabourForm" component={LabourFormScreen} options={{ title: 'Add labour' }} />
      <Stack.Screen name="LabourReportForm" component={LabourReportFormScreen} options={{ title: 'Add labour report' }} />
      <Stack.Screen name="MachineList" component={MachineListScreen} options={{ title: 'Machinery' }} />
      <Stack.Screen name="MachineForm" component={MachineFormScreen} options={{ title: 'Machine entry' }} />
      <Stack.Screen name="MaterialList" component={MaterialListScreen} options={{ title: 'Materials' }} />
      <Stack.Screen name="MaterialForm" component={MaterialFormScreen} options={{ title: 'Material entry' }} />
      <Stack.Screen name="StockModule" component={StockModuleScreen} options={{ title: 'Stock & cement' }} />
      <Stack.Screen name="VendorsList" component={VendorsListScreen} options={{ title: 'Vendors' }} />
      <Stack.Screen name="VendorForm" component={VendorFormScreen} options={{ title: 'Vendor' }} />
      <Stack.Screen name="AccountsProjectList" component={AccountsProjectListScreen} options={{ title: 'Select project' }} />
      <Stack.Screen name="Accounts" component={AccountsDashboardScreen} options={{ title: 'Accounts' }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add expense' }} />
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} options={{ title: 'Expenses' }} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} options={{ title: 'Expense' }} />
    </Stack.Navigator>
  );
}
