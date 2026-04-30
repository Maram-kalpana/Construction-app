import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';
import { useFocusEffect } from '@react-navigation/native';
import { getMaterialEntries, deleteMaterialEntryApi } from '../../api/materialApi';

// ── Row component ──
// API returns nested item.item.name and item.vendor.name — use those directly
function Row({ item, onEdit, onDelete }) {
  const itemName = item?.item?.name || 'Item #' + item.item_id;
  const vendorName = item?.vendor?.name || '—';
  const projectName = item?.project?.name || '—';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{itemName}</Text>
          <Text style={styles.metaText}>
            Vendor: <Text style={styles.bold}>{vendorName}</Text>
          </Text>
          <Text style={styles.metaText}>
            Project: <Text style={styles.bold}>{projectName}</Text>
          </Text>
        </View>

        {/* Action icons */}
        <View style={styles.actionsIcons}>
          <Pressable onPress={onEdit} style={{ marginRight: 14 }}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#2563eb" />
          </Pressable>
          <Pressable onPress={onDelete}>
            <MaterialCommunityIcons name="delete-outline" size={20} color="#dc2626" />
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <Text style={styles.metaText}>
          Qty: <Text style={styles.bold}>{item.qty || '—'}</Text>
        </Text>
        <Text style={styles.metaText}>
          Date: <Text style={styles.bold}>{item.entry_date || '—'}</Text>
        </Text>
      </View>
    </View>
  );
}

export function MaterialListScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { dateKey, vendors } = useApp();

  const today = dateKey();

  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const [reasonVisible, setReasonVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // useFocusEffect ensures list refreshes when navigating back from MaterialForm
  useFocusEffect(
    React.useCallback(() => {
      fetchMaterials();
    }, [selectedDate])
  );

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // safe date format
      const formattedDate =
        typeof selectedDate === 'string'
          ? selectedDate
          : new Date(selectedDate).toISOString().split('T')[0];

      const res = await getMaterialEntries({
        project_id: projectId,
        entry_date: formattedDate,
      });

      // log full response to diagnose shape
      console.log('MATERIAL API RESPONSE:', JSON.stringify(res?.data, null, 2));

      // handle both array and nested shapes
      const raw = res?.data?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      console.log('MATERIALS COUNT:', list.length);
      setMaterials(list);

    } catch (err) {
      console.log('MATERIAL API ERROR:', err?.response?.data || err);
      setMaterials([]);
    }
    setLoading(false);
  };

  // ✅ filteredMaterials from API data (not bundle)
  const filteredMaterials = (materials || []).filter((m) => {
    if (!search.trim()) return true;
    return String(m.item_id).toLowerCase().includes(search.toLowerCase());
  });

  const handleEdit = (item) => {
    setSelectedItem(item);
    setActionType('edit');
    setReasonVisible(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setActionType('delete');
    setReasonVisible(true);
  };

  const handleContinue = async () => {
    if (!reason.trim()) {
      alert('Enter reason');
      return;
    }
    setReasonVisible(false);

    if (actionType === 'edit') {
      navigation.navigate('MaterialForm', {
        projectId,
        entryId: selectedItem.id,
        direction: selectedItem.direction,
      });
    }

    if (actionType === 'delete') {
      try {
        await deleteMaterialEntryApi(selectedItem.id);
        fetchMaterials();
      } catch (err) {
        console.log('DELETE ERROR:', err?.response?.data || err);
      }
    }

    setReason('');
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.h1}>Materials</Text>
          <Text style={styles.sub}>Inward deliveries and outward consumption (qty / nos).</Text>
        </View>

        {/* Search — gap replaced with marginLeft on TextInput */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search item..."
            placeholderTextColor={colors.mutedText}
          />
        </View>

        {/* Actions — gap replaced with marginRight on DatePickerField wrapper */}
        <View style={styles.actions}>
          <View style={styles.actionsLeft}>
            <DatePickerField label="" value={selectedDate} onChange={setSelectedDate} />
          </View>
          <View style={styles.actionsRight}>
            <GradientButton
              title="Add Material"
              onPress={() => navigation.navigate('MaterialForm', { projectId, direction: 'in' })}
              colors={['#2f86de', '#62b6ff']}
              left={<MaterialCommunityIcons name="plus-circle-outline" size={18} color="#fff" />}
            />
          </View>
        </View>

        {/* List — gap on contentContainerStyle replaced with marginBottom on card */}
        <FlatList
          data={filteredMaterials}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : `${item.item_id}_${index}`
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Row
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="package-variant" size={36} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No material lines</Text>
              <Text style={styles.emptyText}>
                Log cement, sand, bricks, diesel, or other items.
              </Text>
            </View>
          }
        />

        {/* Reason Modal */}
        <Modal visible={reasonVisible} transparent animationType="slide" statusBarTranslucent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.dragHandle} />
              <Text style={styles.modalTitle}>Enter Reason</Text>
              <TextInput
                placeholder="Enter reason..."
                placeholderTextColor="#9ca3af"
                value={reason}
                onChangeText={setReason}
                style={styles.modalInput}
                multiline
                numberOfLines={4}
              />
              <Pressable style={styles.continueBtn} onPress={handleContinue}>
                <Text style={styles.continueText}>Continue</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setReasonVisible(false);
                  setReason('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },

  // search — gap replaced with marginLeft on input
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10, marginLeft: 8 },

  // actions — gap replaced with marginRight on left child
  actions: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  actionsLeft: { flex: 1, marginRight: 10 },
  actionsRight: { flex: 1 },

  // list — gap replaced with marginBottom on card
  list: { padding: 16, paddingBottom: 28 },

  // card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12, // replaces gap: 12 on list
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  // actionsIcons — gap replaced with marginRight inline
  actionsIcons: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  cardBottom: {},

  name: { color: colors.text, fontSize: 15, fontWeight: '900', marginBottom: 4 },
  metaText: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  bold: { color: '#111827', fontWeight: '700' },

  empty: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  emptyTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },

  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 14, color: '#111827' },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    padding: 16,
    height: 110,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  continueBtn: {
    backgroundColor: '#2f6fed',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelText: { textAlign: 'center', color: '#dc2626', fontWeight: '600', fontSize: 15 },
});