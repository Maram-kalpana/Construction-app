import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

const modules = [
  { key: 'LabourList', title: 'Labour', subtitle: "Today's headcount & work done", icon: 'account-hard-hat', colors: ['#14532d', '#22c55e'] },
  { key: 'MachineList', title: 'Machinery', subtitle: 'Hours, party & output', icon: 'excavator', colors: ['#9a3412', '#fb923c'] },
  { key: 'MaterialList', title: 'Material', subtitle: 'Inward / outward items', icon: 'cube-outline', colors: ['#6b21a8', '#c084fc'] },
  { key: 'StockModule', title: 'Stock', subtitle: 'Cement consumption & stock report', icon: 'warehouse', colors: ['#1e3a8a', '#60a5fa'] },
];

export function ProjectModulesScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { projects } = useApp();
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{project?.name ?? 'Project'}</Text>
        <Text style={styles.sub}>{project?.location ?? ''}</Text>

        <View style={styles.headerCard}>
          <Text style={styles.sectionLabel}>Project details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Project ID</Text>
            <Text style={styles.detailValue}>{projectId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{project?.status ?? '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{project?.location ?? '—'}</Text>
          </View>
        </View>

        <Text style={styles.modulesTitle}>Modules</Text>
        {modules.map((m) => (
          <Pressable key={m.key} onPress={() => navigation.navigate(m.key, { projectId })} style={styles.modPress}>
            <GradientCard colors={m.colors} style={styles.modCard}>
              <View style={styles.modRow}>
                <MaterialCommunityIcons name={m.icon} size={24} color="#fff" />
                <View style={styles.modText}>
                  <Text style={styles.modTitle}>{m.title}</Text>
                  <Text style={styles.modSub}>{m.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={26} color="rgba(255,255,255,0.9)" />
              </View>
            </GradientCard>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 32 },
  h1: { fontSize: 24, fontWeight: '900', color: colors.text },
  sub: { marginTop: 4, color: colors.mutedText, marginBottom: 14 },
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.72)',
    padding: 14,
    marginBottom: 18,
  },
  sectionLabel: { color: colors.text, fontWeight: '900', marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  detailLabel: { color: colors.mutedText, fontWeight: '800' },
  detailValue: { color: colors.text, fontWeight: '900', textAlign: 'right', flexShrink: 1 },
  modulesTitle: { color: colors.text, fontWeight: '900', fontSize: 16, marginBottom: 10 },
  modPress: { marginBottom: 12 },
  modCard: { width: '100%' },
  modRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modText: { flex: 1 },
  modTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  modSub: { marginTop: 4, color: 'rgba(255,255,255,0.88)', fontSize: 13 },
});
