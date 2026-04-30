import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { getMaterialConsumptions } from '../../api/stockApi';

export function StockModuleScreen({ route, navigation }) {
  const { projectId, vendorId, itemId } = route.params || {};

  const { dateKey, vendors } = useApp();
  const today = dateKey();

  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');

  const [reasonVisible, setReasonVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState('');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchStock();
    }, [selectedDate])
  );

  const fetchStock = async () => {
    setLoading(true);
    try {
      let formattedDate;
      if (!selectedDate) {
        formattedDate = dateKey();
      } else if (typeof selectedDate === 'string') {
        formattedDate = selectedDate;
      } else {
        formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      }

      const params = {
        project_id: projectId,
        vendor_id: vendorId,
        item_id: itemId,
        date: formattedDate,
      };

      console.log('FINAL PARAMS:', params);

      const res = await getMaterialConsumptions(params);
      console.log('API RESPONSE:', res.data);

      if (res?.data?.success) {
        setRows(res.data.data.lines || []);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.log('API ERROR:', err?.response?.data || err);
      setRows([]);
    }
    setLoading(false);
  };

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

  const handleContinue = () => {
    if (!reason.trim()) return;
    setReasonVisible(false);
    if (actionType === 'edit') {
      navigation.navigate('StockModule', {
        projectId,
        vendorId,
        itemId,
        refresh: true,
      });
    }
    // delete API not integrated yet
    setReason('');
  };

  // Defined right before render so rows state is always available
  const filteredRows = (rows || []).filter((item) => {
    if (!search.trim()) return true;
    const vendor = (vendors || []).find((v) => v.id === item.vendor_id);
    return vendor?.name?.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <ScreenContainer>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading stock...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>

        {/* HEADER */}
        <Text style={styles.h1}>Stock</Text>
        <Text style={styles.sub}>
          Vendor, open balance, received, and remaining stock.
        </Text>

        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
          <TextInput
            placeholder="Search vendor..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* ACTIONS — gap replaced with marginRight on first child */}
        <View style={styles.actions}>
          <View style={styles.actionsLeft}>
            <DatePickerField value={selectedDate} onChange={setSelectedDate} />
          </View>
          <View style={styles.actionsRight}>
            <GradientButton
              title="Add Stock"
              onPress={() => navigation.navigate('StockForm', { projectId })}
            />
          </View>
        </View>

        {/* LIST */}
        <FlatList
          data={filteredRows}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="package-variant-closed" size={40} color="#ccc" />
              <Text style={styles.emptyTitle}>No stock entries</Text>
              <Text style={styles.emptyText}>Add stock using the button above.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const vendor = vendors.find((v) => v.id === item.vendor_id);
            return (
              <View style={styles.card}>
                <View style={styles.cardRow}>

                  {/* ICON */}
                  <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="package-variant" size={24} color="#2563eb" />
                  </View>

                  {/* CONTENT */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{vendor?.name || 'Vendor'}</Text>
                    <Text style={styles.title}>Work: {item.work}</Text>
                    <Text style={styles.meta}>Qty: {item.qty}</Text>
                  </View>

                  {/* ACTION ICONS — gap replaced with marginRight on first button */}
                  <View style={styles.iconActions}>
                    <Pressable style={[styles.iconBtn, { marginRight: 8 }]} onPress={() => handleEdit(item)}>
                      <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
                    </Pressable>
                    <Pressable style={styles.iconBtn} onPress={() => handleDelete(item)}>
                      <MaterialCommunityIcons name="delete" size={20} color="#dc2626" />
                    </Pressable>
                  </View>

                </View>
              </View>
            );
          }}
        />

        {/* MODAL */}
        <Modal visible={reasonVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {actionType === 'edit' ? 'Edit Reason' : 'Delete Reason'}
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Enter reason..."
                style={styles.input}
                multiline
              />
              <GradientButton title="Continue" onPress={handleContinue} />
              <Pressable onPress={() => setReasonVisible(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  h1: { fontSize: 28, fontWeight: '900', color: '#1a2f4e' },
  sub: { fontSize: 14, color: '#7a8fa8', marginTop: 4, marginBottom: 16 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e2eaf4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  searchInput: { marginLeft: 8, flex: 1 },

  // ✅ gap removed — use marginRight on first child instead
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsLeft: { flex: 1, marginRight: 12 },
  actionsRight: { flex: 1 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2eaf4',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#eaf2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  title: { fontSize: 16, fontWeight: '900', color: '#1a2f4e' },
  meta: { fontSize: 13, color: '#7a8fa8', marginTop: 3 },

  // ✅ gap removed — marginRight applied inline on first button
  iconActions: { flexDirection: 'row' },
  iconBtn: { padding: 6, borderRadius: 10, backgroundColor: '#f1f5f9' },

  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 10, fontWeight: '900', fontSize: 16, color: '#374151' },
  emptyText: { marginTop: 6, color: '#7a8fa8', fontSize: 13 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontWeight: '800', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginBottom: 12,
  },
  cancel: { textAlign: 'center', color: 'red', marginTop: 10 },
});