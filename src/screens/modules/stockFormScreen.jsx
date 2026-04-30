import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { addMaterialConsumption } from '../../api/stockApi';
import { getProjects } from '../../api/projectApi';
import { getVendorsByType } from '../../api/vendorApi';
import { getItems } from '../../api/itemApi';
import { colors } from '../../theme/theme';

export function StockFormScreen({ route, navigation }) {
  const { projectId } = route.params;

  const { dateKey } = useApp();
  const today = dateKey();

  const [date, setDate] = useState(today);
  const [itemId, setItemId] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [openBal, setOpenBal] = useState('');
  const [received, setReceived] = useState('');
  const [cum, setCum] = useState('');
  const [bal, setBal] = useState('');
  const [lines, setLines] = useState([]);
  const [work, setWork] = useState('');
  const [qty, setQty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [projects, setProjects] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [pRes, vRes, iRes] = await Promise.all([
        getProjects(),
        getVendorsByType(),
        getItems(),
      ]);

      if (pRes?.data?.success) setProjects(pRes.data.data);
      if (vRes?.data?.success) setVendorsList(vRes.data.data);

      if (iRes?.data?.success && iRes.data.data.length > 0) {
        setItemsList(iRes.data.data);
      } else {
        setItemsList([
          { id: 1, name: 'Cement' },
          { id: 2, name: 'Steel' },
          { id: 3, name: 'Sand' },
        ]);
      }
    } catch (err) {
      console.log('DROPDOWN ERROR:', err?.response?.data || err);
    }
  };

  const onAddLine = () => {
    if (!work.trim()) {
      Alert.alert('Missing', 'Enter work');
      return;
    }
    setLines((prev) => [...prev, { id: Date.now().toString(), work, qty }]);
    setWork('');
    setQty('');
  };

  const onDeleteLine = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const onSave = async () => {
    if (!itemId || !vendorId || !selectedProject) {
      Alert.alert('Error', 'Select project, item and vendor');
      return;
    }
    if (lines.length === 0) {
      Alert.alert('Error', 'Add at least one line');
      return;
    }

    try {
      // ✅ FIXED: safe date formatting — avoids Invalid Date on Android
      const formattedDate =
        typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];

      for (let line of lines) {
        await addMaterialConsumption({
          project_id: Number(selectedProject),
          vendor_id: Number(vendorId),
          item_id: Number(itemId),
          date: formattedDate,
          work: line.work,
          qty: String(line.qty),
        });
      }

      Alert.alert('Success', 'Stock saved');

      navigation.navigate('StockModule', {
        projectId: selectedProject,
        vendorId: vendorId,
        itemId: itemId,
        refresh: true,
      });
    } catch (err) {
      console.log('SAVE ERROR:', err?.response?.data || err);
      Alert.alert('Error', 'Failed to save');
    }
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>

          <Text style={styles.h1}>Cement & stock</Text>
          <Text style={styles.sub}>
            Consumption by work, opening balance, receipts, and closing balance.
          </Text>

          {/* Date + Project — gap replaced with marginRight on first child */}
          <View style={styles.topRow}>
            <View style={styles.topLeft}>
              <DatePickerField label="Date" value={date} onChange={setDate} />
            </View>
            <View style={styles.topRight}>
              <SelectField
                label="Project"
                value={selectedProject}
                onChange={setSelectedProject}
                options={[
                  { label: 'Select project', value: null },
                  ...projects.map((p) => ({
                    label: p.name || p.project_name,
                    value: p.id,
                  })),
                ]}
              />
            </View>
          </View>

          {/* STOCK REPORT */}
          <View style={styles.card}>
            <Text style={styles.section}>Cement stock report</Text>

            <SelectField
              label="Item"
              value={itemId}
              onChange={setItemId}
              options={[
                { label: 'Select item', value: null },
                ...(itemsList || []).map((i) => ({ label: i.name, value: i.id })),
              ]}
            />

            <SelectField
              label="Vendor"
              value={vendorId}
              onChange={setVendorId}
              options={[
                { label: 'Select vendor', value: null },
                ...(vendorsList || []).map((v) => ({ label: v.name, value: v.id })),
              ]}
            />

            {/* gap replaced with marginRight on left field */}
            <View style={styles.fieldRow}>
              <AppTextField
                label="Open bal."
                value={openBal}
                onChangeText={setOpenBal}
                style={styles.fieldLeft}
              />
              <AppTextField
                label="Received"
                value={received}
                onChangeText={setReceived}
                style={styles.fieldRight}
              />
            </View>

            <View style={styles.fieldRow}>
              <AppTextField
                label="Cumulative"
                value={cum}
                onChangeText={setCum}
                style={styles.fieldLeft}
              />
              <AppTextField
                label="Balance"
                value={bal}
                onChangeText={setBal}
                style={styles.fieldRight}
              />
            </View>
          </View>

          {/* CONSUMPTION */}
          <View style={styles.card}>
            <Text style={styles.section}>Cement consumption</Text>

            <FlatList
              data={lines}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.lineRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lineWork}>{item.work}</Text>
                    <Text style={styles.lineQty}>Qty: {item.qty || '-'}</Text>
                  </View>
                  <Pressable onPress={() => onDeleteLine(item.id)}>
                    <MaterialCommunityIcons name="delete" size={20} color="red" />
                  </Pressable>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>No consumption lines yet.</Text>
              }
            />

            <AppTextField
              label="Work"
              value={work}
              onChangeText={setWork}
              placeholder="PCC / Brick work"
            />

            <AppTextField
              label="Qty (bags)"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
            />

            <GradientButton
              title="Add consumption line"
              onPress={onAddLine}
              colors={['#2f86de', '#62b6ff']}
            />
          </View>

          {/* REMARKS */}
          <View style={styles.card}>
            <Text style={styles.section}>Remarks / details report</Text>
            <AppTextField
              label="Narrative notes"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={5}
            />
          </View>

          <GradientButton
            title="Save stock"
            onPress={onSave}
            colors={['#2f86de', '#62b6ff']}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },

  h1: { fontSize: 22, fontWeight: '900', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 12 },

  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.outline,
    marginBottom: 14,
  },
  section: { fontWeight: '900', marginBottom: 10 },

  // ✅ gap removed — marginRight on left field
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  topLeft: { flex: 1, marginRight: 10 },
  topRight: { flex: 1 },

  fieldRow: { flexDirection: 'row', marginBottom: 0 },
  fieldLeft: { flex: 1, marginRight: 10 },
  fieldRight: { flex: 1 },

  lineRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.outline,
  },
  lineWork: { fontWeight: '800' },
  lineQty: { color: colors.mutedText, fontSize: 12 },
  empty: { color: colors.mutedText, marginBottom: 10 },
});