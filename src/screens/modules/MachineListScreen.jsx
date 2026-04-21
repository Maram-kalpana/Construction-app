import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function MachineListScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { getDailyBundle, dateKey } = useApp();
  const today = dateKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');
  const rows = useMemo(() => {
    const all = getDailyBundle(projectId, selectedDate).machines;
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((m) => (m.partyName || '').toLowerCase().includes(q) || (m.workDone || '').toLowerCase().includes(q));
  }, [getDailyBundle, projectId, selectedDate, search]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.h1}>Machinery</Text>
          <Text style={styles.sub}>Party / equipment, start / close time, total hours.</Text>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search party / equipment..."
            placeholderTextColor={colors.mutedText}
          />
        </View>
        <View style={styles.dateRow}>
          <DatePickerField label="" value={selectedDate} onChange={setSelectedDate} style={styles.dateBtnWrap} />
          <GradientButton
            title="Add Machine"
            onPress={() => navigation.navigate('MachineForm', { projectId })}
            colors={['#2f86de', '#62b6ff']}
            style={styles.addBtn}
            left={<MaterialCommunityIcons name="plus-circle-outline" size={18} color="#fff" />}
          />
        </View>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('MachineForm', { projectId, entryId: item.id })} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="excavator" size={22} color="#2f86de" />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.name}>{item.partyName || 'Party'}</Text>
                  <Text style={styles.sub2}>
                    {item.startTime || '—'} → {item.endTime || '—'} • {item.totalHrs || '0'} hrs
                  </Text>
                  {item.workDone ? <Text style={styles.work}>{item.workDone}</Text> : null}
                </View>
                <MaterialCommunityIcons name="pencil" size={20} color={colors.mutedText} />
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="bulldozer" size={36} color="rgba(233,242,242,0.5)" />
              <Text style={styles.emptyTitle}>No machinery logged</Text>
              <Text style={styles.emptyText}>Record excavators, mixers, or hired plant for the day.</Text>
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
  dateRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  dateBtnWrap: { flex: 1 },
  addBtn: { flex: 1 },
  list: { padding: 16, paddingBottom: 120, gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(98,182,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '900' },
  sub2: { marginTop: 4, color: colors.mutedText, fontSize: 12 },
  work: { marginTop: 6, color: colors.text, fontSize: 13, lineHeight: 18 },
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
