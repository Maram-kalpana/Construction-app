import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function MachineListScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { getDailyBundle, dateKey } = useApp();
  const today = dateKey();
  const rows = useMemo(() => getDailyBundle(projectId, today).machines, [getDailyBundle, projectId, today]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.h1}>Machinery</Text>
          <Text style={styles.sub}>Party name, start / close time, total hours, work done (measurements).</Text>
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
        <View style={styles.footer}>
          <GradientButton
            title="Add machine shift"
            onPress={() => navigation.navigate('MachineForm', { projectId })}
            colors={['#2f86de', '#62b6ff']}
            left={<MaterialCommunityIcons name="plus" size={18} color="#fff" />}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },
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
  footer: { position: 'absolute', left: 16, right: 16, bottom: 16 },
});
