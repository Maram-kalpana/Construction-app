import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SelectField } from '../../components/SelectField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function MaterialFormScreen({ route, navigation }) {
  const { projectId, entryId, direction: dirParam } = route.params;
  const direction = dirParam === 'out' ? 'out' : 'in';

  // ✅ 1. get app FIRST
  const app = useApp();

  // ✅ 2. extract safely
  const getDailyBundle = app?.getDailyBundle;
  const addMaterialEntry = app?.addMaterialEntry;
  const deleteMaterialEntry = app?.deleteMaterialEntry;
  const materialItemOptions = app?.materialItemOptions || (() => []);
  const vendors = app?.vendors || [];
  const dateKey = app?.dateKey || (() => new Date().toISOString().slice(0, 10));

  // ✅ 3. compute today
  const today = dateKey();

  // ✅ 4. now safe to use
  const bundle = getDailyBundle
    ? getDailyBundle(projectId, today)
    : { materialsIn: [], materialsOut: [] };

  const list =
    direction === 'out'
      ? bundle.materialsOut || []
      : bundle.materialsIn || [];

  const editing = useMemo(
    () => list.find((e) => e.id === entryId) ?? null,
    [list, entryId]
  );

  // ✅ 5. state AFTER everything
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState('');
  const [supplier, setSupplier] = useState('');
  const [vendorId, setVendorId] = useState(null);
  const [projectIdState, setProjectIdState] = useState(projectId || null);

  useEffect(() => {
  if (!editing) return;
  setItemName(editing.itemName ?? '');
  setQty(String(editing.qty ?? ''));
  setSupplier(editing.supplier ?? '');
  setVendorId(editing.vendorId ?? null);
  setProjectIdState(editing.projectId ?? projectId); // ✅ ADD THIS
}, [editing]);

  const itemOptions = useMemo(
    () => materialItemOptions(projectId).filter((name) => name.toLowerCase().includes(itemName.toLowerCase())).slice(0, 6),
    [itemName, materialItemOptions, projectId],
  );

  const onSave = async () => {
    if (itemName.trim().length < 2) {
      Alert.alert('Missing', 'Enter item name.');
      return;
    }
    await addMaterialEntry(
      projectIdState,
      {
        id: editing?.id,
        direction,
        itemName,
        qty,
        supplier,
        vendorId,
      },
      today,
    );
    navigation.goBack();
  };

  const onDelete = () => {
    if (!editing) return;
    Alert.alert('Delete', 'Remove this material line?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMaterialEntry(projectId, editing.id, direction, today);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.pill}>
            <Text style={styles.pillText}>{direction === 'out' ? 'Outgoing / used' : 'Incoming delivery'}</Text>
          </View>
          <SelectField
            label="Item name"
            value={itemName || null}
            onChange={(v) => setItemName(v || '')}
            placeholder="e.g. Cement / Sand / Bricks"
            options={[
              { label: 'Select item', value: null },
              { label: 'Cement (OPC 53)', value: 'Cement (OPC 53)' },
              { label: 'River Sand', value: 'River Sand' },
              { label: 'Bricks', value: 'Bricks' },
              { label: 'Steel', value: 'Steel' },
              ...itemOptions.map((name) => ({ label: name, value: name })),
            ]}
          />
          <AppTextField
            label="Qty / nos."
            value={qty}
            onChangeText={setQty}
            placeholder="0"
          />

          {/* ── Project ── */}
<SelectField
  label="Project"
  value={projectIdState}
  onChange={setProjectIdState}
  placeholder="Select project"
  options={[
    { label: 'Current Project', value: projectId },
  ]}
/>
          <AppTextField label="Supplier (optional)" value={supplier} onChangeText={setSupplier} placeholder="Optional" />
          {/* ── Project ── */}
<SelectField
  label="Project"
  value={projectIdState}
  onChange={setProjectIdState}
  placeholder="Select project"
  options={[
    { label: 'Current Project', value: projectId },
  ]}
/>
 <SelectField
            label="Vendor"
            value={vendorId}
            onChange={setVendorId}
            placeholder="Select vendor"
            options={[
              { label: 'Select vendor', value: null },
              { label: 'Ravi Hire', value: 'ven_demo_1' },
              { label: 'ACC Dealer', value: 'ven_demo_2' },
              { label: 'Sri Ganesh', value: 'ven_demo_3' },
              ...vendors.map((v) => ({ label: v.name, value: v.id })),
            ]}
          />
          <GradientButton
            title={editing ? 'Update' : 'Save'}
            onPress={onSave}
            colors={['#2f86de', '#62b6ff']}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
          {editing ? (
            <Pressable onPress={onDelete} style={styles.del}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#fca5a5" />
              <Text style={styles.delText}>Delete</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(45,127,218,0.10)',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(45,127,218,0.22)',
  },
  pillText: { color: '#1d78d8', fontWeight: '900', fontSize: 12 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -4, marginBottom: 10 },
  optionChip: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionText: { color: '#1e3a5f', fontWeight: '700', fontSize: 12 },
  del: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' },
  delText: { color: '#fca5a5', fontWeight: '800' },
});
