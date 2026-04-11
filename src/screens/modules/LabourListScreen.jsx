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

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.h1}>Labour Report</Text>
          <Text style={styles.sub}>
            Party / masonry, mason count, skilled male, unskilled female — linked to worker profile.
          </Text>
        </View>

        {/* ── TABLE HEADER ── */}
        <View style={styles.tableWrap}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thCell, styles.colSl]}>Sl.{'\n'}No.</Text>
            <Text style={[styles.thCell, styles.colParty]}>Party Name</Text>
            <Text style={[styles.thCell, styles.colLabour]}>M</Text>
            <Text style={[styles.thCell, styles.colLabour]}>F</Text>
            <Text style={[styles.thCell, styles.colLabour]}>Mation</Text>
            <Text style={[styles.thCell, styles.colWork]}>Work Done{'\n'}Measurements</Text>
          </View>

          {/* ── TABLE ROWS via FlatList ── */}
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const person = labourPersonById(item.labourId);
              return (
                <Pressable
                  onPress={() => navigation.navigate('LabourReportForm', { projectId, entryId: item.id })}
                  style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}
                >
                  <Text style={[styles.tdCell, styles.colSl]}>{index + 1}</Text>
                  <Text style={[styles.tdCell, styles.colParty]} numberOfLines={2}>
                    {item.masteryName || person?.name || '—'}
                  </Text>
                  <Text style={[styles.tdCell, styles.colLabour]}>{item.mason || '0'}</Text>
                  <Text style={[styles.tdCell, styles.colLabour]}>{item.maleSkilled || '0'}</Text>
                  <Text style={[styles.tdCell, styles.colLabour]}>{item.femaleUnskilled || '0'}</Text>
                  <Text style={[styles.tdCell, styles.colWork]} numberOfLines={3}>
                    {item.workDone || '—'}
                  </Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialCommunityIcons name="account-group-outline" size={36} color="#ccc" />
                <Text style={styles.emptyTitle}>No labour rows yet</Text>
                <Text style={styles.emptyText}>Add workers for today using the button below.</Text>
              </View>
            }
          />
        </View>

        {/* ── SINGLE ADD BUTTON at bottom ── */}
        <View style={styles.footer}>
          <GradientButton
            title="Add Labour Report"
            onPress={() => navigation.navigate('LabourReportForm', { projectId })}
            left={<MaterialCommunityIcons name="plus" size={18} color="#fff" />}
          />
        </View>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18, fontSize: 13 },

  // ── TABLE ──
  tableWrap: {
    flex: 1,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#c8d6e5',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderBottomWidth: 1,
    borderBottomColor: '#93c5fd',
  },

  thCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1e3a5f',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#93c5fd',
  },

  list: { paddingBottom: 10 },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2eaf4',
    backgroundColor: '#fff',
  },

  rowEven: {
    backgroundColor: '#f8fbff',
  },

  tdCell: {
    fontSize: 12,
    color: '#1f2f4b',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#e2eaf4',
  },

  // column widths
  colSl:     { width: 36 },
  colParty:  { flex: 1, textAlign: 'left', paddingLeft: 8 },
  colLabour: { width: 44 },
  colWork:   { flex: 1, textAlign: 'left', paddingLeft: 6 },

  empty: {
    alignItems: 'center',
    padding: 30,
  },

  emptyTitle: {
    marginTop: 10,
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
  },

  emptyText: {
    marginTop: 6,
    color: colors.mutedText,
    textAlign: 'center',
    fontSize: 13,
  },

  // ── FOOTER ──
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});