import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
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

function formatListDate(selectedDate, dateKey) {
  if (!selectedDate) return dateKey();
  if (typeof selectedDate === 'string') return selectedDate;
  return new Date(selectedDate).toISOString().split('T')[0];
}

export function StockModuleScreen({ route, navigation }) {
  const { projectId } = route.params || {};
  const { dateKey, getStockByProject, deleteStockEntry } = useApp();
  const today = dateKey();

  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');

  const dateStr = formatListDate(selectedDate, dateKey);

  const rows = useMemo(() => {
    const all = getStockByProject(projectId) || [];
    return all.filter((s) => String(s.date) === String(dateStr));
  }, [getStockByProject, projectId, dateStr]);

  const filteredRows = (rows || []).filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const v = String(item.vendorName || '').toLowerCase();
    const it = String(item.itemName || '').toLowerCase();
    return v.includes(q) || it.includes(q);
  });

  const handleEdit = (item) => {
    navigation.navigate('StockForm', { projectId, entryId: item.id });
  };

  const handleDelete = (item) => {
    Alert.alert('Delete stock', 'Remove this stock row?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteStockEntry(item.id),
      },
    ]);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.h1}>Stock</Text>
        <Text style={styles.sub}>
          Vendor, open balance, received, and remaining stock (saved on this device).
        </Text>

        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#64748b" />
          <TextInput
            placeholder="Search vendor or item..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.actions}>
          <View style={styles.actionsDate}>
            <DatePickerField
              label={null}
              value={selectedDate}
              onChange={setSelectedDate}
              style={styles.dateField}
            />
          </View>
          <View style={styles.actionsBtn}>
            <GradientButton
              title="Add Stock"
              onPress={() => navigation.navigate('StockForm', { projectId })}
              colors={['#2f86de', '#62b6ff']}
              left={<MaterialCommunityIcons name="plus-circle-outline" size={18} color="#fff" />}
            />
          </View>
        </View>

        <FlatList
          data={filteredRows}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="package-variant-closed" size={40} color="#ccc" />
              <Text style={styles.emptyTitle}>No stock entries</Text>
              <Text style={styles.emptyText}>Add stock using the button above.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="package-variant" size={24} color="#2563eb" />
                </View>

                <View style={styles.cardMain}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.vendorName || 'Vendor'}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    Item: {item.itemName || '—'}
                  </Text>
                  {!!item.editReason && (
                    <Text style={styles.editReasonLine} numberOfLines={2}>
                      Edit reason: {item.editReason}
                    </Text>
                  )}
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricCell}>
                      <View style={styles.metricInner}>
                        <Text style={styles.metricLabel}>Open</Text>
                        <Text style={styles.metricValue}>{item.openBal ?? '—'}</Text>
                      </View>
                    </View>
                    <View style={styles.metricCell}>
                      <View style={styles.metricInner}>
                        <Text style={styles.metricLabel}>Received</Text>
                        <Text style={styles.metricValue}>{item.received ?? '—'}</Text>
                      </View>
                    </View>
                    <View style={styles.metricCell}>
                      <View style={styles.metricInner}>
                        <Text style={styles.metricLabel}>Cumulative</Text>
                        <Text style={styles.metricValue}>{item.cum ?? '—'}</Text>
                      </View>
                    </View>
                    <View style={styles.metricCell}>
                      <View style={styles.metricInner}>
                        <Text style={styles.metricLabel}>Balance</Text>
                        <Text style={styles.metricValue}>{item.bal ?? '—'}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.iconActions}>
                  <Pressable style={[styles.iconBtn, styles.iconBtnSp]} onPress={() => handleEdit(item)}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
                  </Pressable>
                  <Pressable style={styles.iconBtn} onPress={() => handleDelete(item)}>
                    <MaterialCommunityIcons name="delete" size={20} color="#dc2626" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
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

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionsDate: { flex: 1, marginRight: 12, justifyContent: 'center' },
  actionsBtn: { flex: 1, justifyContent: 'center' },
  dateField: { marginBottom: 0 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2eaf4',
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardMain: { flex: 1, minWidth: 0, marginRight: 8 },

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
  meta: { fontSize: 13, color: '#475569', marginTop: 4, fontWeight: '600' },
  editReasonLine: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: -4,
  },
  metricCell: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  metricInner: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  metricLabel: { fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
  metricValue: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginTop: 2 },

  iconActions: { flexDirection: 'column', alignItems: 'center', paddingTop: 2 },
  iconBtn: { padding: 8, borderRadius: 10, backgroundColor: '#f1f5f9' },
  iconBtnSp: { marginBottom: 8 },

  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { marginTop: 10, fontWeight: '900', fontSize: 16, color: '#374151' },
  emptyText: { marginTop: 6, color: '#7a8fa8', fontSize: 13 },
});
