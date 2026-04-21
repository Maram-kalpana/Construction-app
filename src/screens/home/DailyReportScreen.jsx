import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function DailyReportScreen() {
  const {
    labourEntries = [],
    machineEntries = [],
    materialEntries = [],
  } = useApp();

  const [date, setDate] = useState('');
  const [showLabour, setShowLabour] = useState(false);
  const [showMachine, setShowMachine] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);

  // ✅ FILTER DATA BASED ON DATE
  const labourData = labourEntries.filter((l) => l.date === date);
  const machineData = machineEntries.filter((m) => m.date === date);
  const materialData = materialEntries.filter((m) => m.date === date);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>DAILY PROGRESS REPORT</Text>

        {/* INPUTS */}
        <TextInput style={styles.input} placeholder="Site Name" />
        <TextInput style={styles.input} placeholder="Supervisor Name" />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />

        {/* LABOUR */}
        <Pressable style={styles.card} onPress={() => setShowLabour(!showLabour)}>
          <Text style={styles.cardTitle}>Labour</Text>
        </Pressable>

        {showLabour && (
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>LABOUR DETAILS</Text>

            <View style={styles.rowHeader}>
              <Text style={styles.col}>Party</Text>
              <Text style={styles.col}>M</Text>
              <Text style={styles.col}>F</Text>
              <Text style={styles.col}>Work</Text>
              <Text style={styles.col}>Action</Text>
            </View>

            {labourData.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.col}>{item.partyName}</Text>
                <Text style={styles.col}>{item.male}</Text>
                <Text style={styles.col}>{item.female}</Text>
                <Text style={styles.col}>{item.work}</Text>
                <Text style={styles.col}>-</Text>
              </View>
            ))}
          </View>
        )}

        {/* MACHINE */}
        <Pressable style={styles.card} onPress={() => setShowMachine(!showMachine)}>
          <Text style={styles.cardTitle}>Machinery</Text>
        </Pressable>

        {showMachine && (
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>MACHINE DETAILS</Text>

            <View style={styles.rowHeader}>
              <Text style={styles.col}>Name</Text>
              <Text style={styles.col}>Start</Text>
              <Text style={styles.col}>Close</Text>
              <Text style={styles.col}>Hrs</Text>
              <Text style={styles.col}>Work</Text>
              <Text style={styles.col}>Action</Text>
            </View>

            {machineData.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.col}>{item.name}</Text>
                <Text style={styles.col}>{item.start}</Text>
                <Text style={styles.col}>{item.close}</Text>
                <Text style={styles.col}>{item.hours}</Text>
                <Text style={styles.col}>{item.work}</Text>
                <Text style={styles.col}>-</Text>
              </View>
            ))}
          </View>
        )}

        {/* MATERIAL */}
        <Pressable style={styles.card} onPress={() => setShowMaterial(!showMaterial)}>
          <Text style={styles.cardTitle}>Materials</Text>
        </Pressable>

        {showMaterial && (
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>MATERIAL DETAILS</Text>

            <View style={styles.rowHeader}>
              <Text style={styles.col}>Item</Text>
              <Text style={styles.col}>Qty</Text>
              <Text style={styles.col}>Action</Text>
            </View>

            {materialData.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.col}>{item.item}</Text>
                <Text style={styles.col}>{item.qty}</Text>
                <Text style={styles.col}>-</Text>
              </View>
            ))}
          </View>
        )}

        {/* SAVE BUTTON */}
        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Report</Text>
        </Pressable>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  sheetTitle: {
    fontWeight: '900',
    marginBottom: 10,
  },

  rowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 6,
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 6,
  },

  col: {
    flex: 1,
    fontSize: 12,
  },

  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    fontWeight: '800',
  },
});