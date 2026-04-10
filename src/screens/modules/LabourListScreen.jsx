import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function LabourListScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { getDailyBundle, labourPersonById, dateKey } = useApp();
  const today = dateKey();
  const bundle = getDailyBundle(projectId, today);
  const rows = useMemo(
    () =>
      [...bundle.labourEntries].sort((a, b) =>
        (labourPersonById(a.labourId)?.name ?? '').localeCompare(labourPersonById(b.labourId)?.name ?? ''),
      ),
    [bundle.labourEntries, labourPersonById],
  );

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.h1}>Labour report</Text>
          <Text style={styles.sub}>Party / masonry, mason count, skilled male, unskilled female — linked to worker profile.</Text>
        </View>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const person = labourPersonById(item.labourId);
            return (
              <Pressable
                onPress={() => navigation.navigate('LabourForm', { projectId, entryId: item.id })}
                style={styles.card}
              >
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <MaterialCommunityIcons name="account-hard-hat" size={22} color="#fff" />
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.name}>{person?.name ?? 'Worker'}</Text>
                    <Text style={styles.sub2}>
                      {item.masteryName ? `${item.masteryName} • ` : ''}
                      M:{item.mason || '0'} Sk:{item.maleSkilled || '0'} Un:{item.femaleUnskilled || '0'}
                    </Text>
                    {item.workDone ? <Text style={styles.work}>{item.workDone}</Text> : null}
                  </View>
                  <MaterialCommunityIcons name="pencil" size={20} color={colors.mutedText} />
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="account-group-outline" size={36} color="rgba(233,242,242,0.55)" />
              <Text style={styles.emptyTitle}>No labour rows yet</Text>
              <Text style={styles.emptyText}>Add workers for today — new profile or lookup by phone.</Text>
            </View>
          }
        />
        <View style={styles.footer}>
          <GradientButton
            title="Add to today's labour"
            onPress={() => navigation.navigate('LabourForm', { projectId })}
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
    backgroundColor: 'rgba(11,18,19,0.82)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(34,197,94,0.25)',
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.55)',
  },
  emptyTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },
  footer: { position: 'absolute', left: 16, right: 16, bottom: 16 },
});
