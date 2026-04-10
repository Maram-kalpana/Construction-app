import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '../../components/AppTextField';
import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function MaterialFormScreen({ route, navigation }) {
  const { projectId, entryId, direction: dirParam } = route.params;
  const direction = dirParam === 'out' ? 'out' : 'in';
  const { getDailyBundle, addMaterialEntry, deleteMaterialEntry, dateKey } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const list = direction === 'out' ? bundle.materialsOut : bundle.materialsIn;
  const editing = useMemo(() => list.find((e) => e.id === entryId) ?? null, [list, entryId]);

  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState('');
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    if (!editing) return;
    setItemName(editing.itemName ?? '');
    setQty(String(editing.qty ?? ''));
    setSupplier(editing.supplier ?? '');
  }, [editing]);

  const onSave = async () => {
    if (itemName.trim().length < 2) {
      Alert.alert('Missing', 'Enter item name.');
      return;
    }
    await addMaterialEntry(
      projectId,
      {
        id: editing?.id,
        direction,
        itemName,
        qty,
        supplier,
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
          <AppTextField
            label="Item name"
            value={itemName}
            onChangeText={setItemName}
            placeholder="e.g. Cement / Sand / Bricks"
          />
          <AppTextField
            label="Qty / nos."
            value={qty}
            onChangeText={setQty}
            placeholder="0"
          />
          <AppTextField
            label="Supplier (optional)"
            value={supplier}
            onChangeText={setSupplier}
            placeholder="Optional"
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
  del: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'center' },
  delText: { color: '#fca5a5', fontWeight: '800' },
});
