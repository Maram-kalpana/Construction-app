import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

function Row({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.badge, item.direction === 'out' ? styles.badgeOut : styles.badgeIn]}>
          <Text style={styles.badgeText}>{item.direction === 'out' ? 'OUT' : 'IN'}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{item.itemName || 'Item'}</Text>
          <Text style={styles.metaSub}>
            Qty: {item.qty || '—'}
            {item.supplier ? ` • ${item.supplier}` : ''}
          </Text>
        </View>
        <MaterialCommunityIcons name="pencil" size={20} color={colors.mutedText} />
      </View>
    </Pressable>
  );
}

export function MaterialListScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { getDailyBundle, dateKey } = useApp();
  const today = dateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const { materialsIn, materialsOut } = useMemo(() => getDailyBundle(projectId, selectedDate), [getDailyBundle, projectId, selectedDate]);
  const combined = useMemo(
    () =>
      [...materialsIn.map((m) => ({ ...m, direction: 'in' })), ...materialsOut.map((m) => ({ ...m, direction: 'out' }))]
        .filter((m) => !search.trim() || (m.itemName || '').toLowerCase().includes(search.toLowerCase())),
    [materialsIn, materialsOut, search],
  );

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.h1}>Materials</Text>
          <Text style={styles.sub}>Inward deliveries and outward consumption (qty / nos).</Text>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search item name..."
            placeholderTextColor={colors.mutedText}
          />
        </View>
        <View style={styles.actions}>
          <DatePickerField label="" value={selectedDate} onChange={setSelectedDate} style={styles.dateBtnWrap} />
          <GradientButton
            title="Add Material"
            onPress={() => navigation.navigate('MaterialForm', { projectId, direction: 'in' })}
            colors={['#2f86de', '#62b6ff']}
            style={styles.halfBtn}
            left={<MaterialCommunityIcons name="plus-circle-outline" size={18} color="#fff" />}
          />
        </View>
        <FlatList
          data={combined}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Row
              item={item}
              onPress={() => navigation.navigate('MaterialForm', { projectId, entryId: item.id, direction: item.direction })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="package-variant" size={36} color="rgba(233,242,242,0.5)" />
              <Text style={styles.emptyTitle}>No material lines</Text>
              <Text style={styles.emptyText}>Log cement, sand, bricks, diesel, or other items.</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },
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
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.text, paddingVertical: 10 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  dateBtnWrap: { flex: 1 },
  halfBtn: { flex: 1 },
  list: { padding: 16, paddingBottom: 28, gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 },
  badgeIn: { backgroundColor: 'rgba(45,127,218,0.15)' },
  badgeOut: { backgroundColor: 'rgba(45,127,218,0.15)' },
  badgeText: { color: colors.text, fontWeight: '900', fontSize: 11 },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 15, fontWeight: '900' },
  metaSub: { marginTop: 4, color: colors.mutedText, fontSize: 12 },
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
});
