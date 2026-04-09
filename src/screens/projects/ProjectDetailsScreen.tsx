import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GradientButton } from '../../components/GradientButton';
import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import type { ProjectsStackParamList } from '../../navigation/types';
import { colors } from '../../theme/theme';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectDetails'>;

const tabs = ['Labour', 'Stock', 'Machinery', 'Materials', 'Accounts'] as const;
type TabKey = (typeof tabs)[number];

export function ProjectDetailsScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { projects } = useApp();
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  const [activeTab, setActiveTab] = useState<TabKey>('Accounts');

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{project?.name ?? 'Project'}</Text>
        <Text style={styles.sub}>{project?.location ?? ''}</Text>

        <View style={styles.segment}>
          {tabs.map((t) => {
            const active = t === activeTab;
            return (
              <Text key={t} onPress={() => setActiveTab(t)} style={[styles.segItem, active && styles.segItemActive]}>
                {t}
              </Text>
            );
          })}
        </View>

        {activeTab === 'Accounts' ? (
          <GradientCard colors={[colors.brandStart, colors.brandEnd]} style={styles.moduleCard}>
            <View style={styles.moduleHead}>
              <MaterialCommunityIcons name="cash-multiple" size={22} color="#fff" />
              <Text style={styles.moduleTitle}>Accounts</Text>
            </View>
            <Text style={styles.moduleText}>Track total amount received, expenses and live balance for this project.</Text>
            <GradientButton title="Open Accounts Module" onPress={() => navigation.navigate('Accounts', { projectId })} style={styles.moduleBtn} />
          </GradientCard>
        ) : (
          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="progress-wrench" size={34} color="rgba(233,242,242,0.7)" />
            <Text style={styles.placeholderTitle}>{activeTab} module</Text>
            <Text style={styles.placeholderText}>This section is scaffolded. Next we’ll build the full {activeTab} workflow.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 28 },
  h1: { fontSize: 24, fontWeight: '900', color: colors.text },
  sub: { marginTop: 4, color: colors.mutedText, marginBottom: 16 },
  segment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: 'rgba(11,18,19,0.65)',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 16,
    padding: 8,
  },
  segItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    color: 'rgba(233,242,242,0.85)',
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  segItemActive: {
    backgroundColor: 'rgba(66,165,245,0.22)',
    color: colors.text,
  },
  moduleCard: { marginTop: 14 },
  moduleHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moduleTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  moduleText: { marginTop: 10, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },
  moduleBtn: { marginTop: 14 },
  placeholder: {
    marginTop: 18,
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.62)',
  },
  placeholderTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  placeholderText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },
});

