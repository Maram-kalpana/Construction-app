import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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
import { colors } from '../../theme/theme';

export function StockFormScreen({ route, navigation }) {
  const { projectId } = route.params;

  const { dateKey, vendors, addStockEntry } = useApp();
  const today = dateKey();

  const [date, setDate] = useState(today);

  // STOCK REPORT
  const [vendorId, setVendorId] = useState(null);
  const [openBal, setOpenBal] = useState('');
  const [received, setReceived] = useState('');
  const [cum, setCum] = useState('');
  const [bal, setBal] = useState('');

  // CONSUMPTION
  const [lines, setLines] = useState([]);
  const [work, setWork] = useState('');
  const [qty, setQty] = useState('');

  // REMARKS
  const [remarks, setRemarks] = useState('');

  const onAddLine = () => {
    if (!work.trim()) {
      Alert.alert('Missing', 'Enter work');
      return;
    }

    setLines((prev) => [
      ...prev,
      { id: Date.now().toString(), work, qty },
    ]);

    setWork('');
    setQty('');
  };

  const onDeleteLine = (id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

 const onSave = () => {
  const payload = {
    projectId,
    date,
    vendorId,
    openBal,
    received,
    cum,
    bal,
    consumption: lines,
    remarks,
  };

  addStockEntry(payload);   // ⭐ THIS LINE WAS MISSING

  Alert.alert('Saved', 'Stock saved');
  navigation.goBack();
};
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* HEADER */}
          <Text style={styles.h1}>Cement & stock</Text>
          <Text style={styles.sub}>
            Consumption by work, opening balance, receipts, and closing balance.
          </Text>

         <View style={styles.topRow}>
  <View style={styles.halfField}>
    <DatePickerField
      label="Date"
      value={date}
      onChange={setDate}
    />
  </View>

  <View style={styles.halfField}>
    <SelectField
      label="Project"
      value={projectId}
      onChange={() => {}}
      options={[
        { label: 'Current Project', value: projectId },
      ]}
    />
  </View>
</View>

          {/* STOCK REPORT */}
          <View style={styles.card}>
            <Text style={styles.section}>Cement stock report</Text>

            {/* ✅ Vendor dropdown added */}
            <SelectField
              label="Vendor"
              value={vendorId}
              onChange={setVendorId}
              options={[
                { label: 'Select vendor', value: null },
                ...vendors.map((v) => ({
                  label: v.name,
                  value: v.id,
                })),
              ]}
            />

            <View style={styles.row}>
              <AppTextField label="Open bal." value={openBal} onChangeText={setOpenBal} style={styles.half} />
              <AppTextField label="Received" value={received} onChangeText={setReceived} style={styles.half} />
            </View>

            <View style={styles.row}>
              <AppTextField label="Cumulative" value={cum} onChangeText={setCum} style={styles.half} />
              <AppTextField label="Balance" value={bal} onChangeText={setBal} style={styles.half} />
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
              ListEmptyComponent={<Text style={styles.empty}>No consumption lines yet.</Text>}
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

            <GradientButton title="Add consumption line" onPress={onAddLine} colors={['#2f86de', '#62b6ff']} />
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

          {/* SAVE */}
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

  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },

  lineRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.outline,
  },

  lineWork: { fontWeight: '800' },
  lineQty: { color: colors.mutedText, fontSize: 12 },

  empty: { color: colors.mutedText, marginBottom: 10 },
  topRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 10,
  marginBottom: 16, // 🔥 spacing from next section
},

halfField: {
  flex: 1,
},
});