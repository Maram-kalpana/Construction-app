import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function DashboardScreen() {
  const { projects } = useApp();

  const stats = useMemo(
    () => ({
      totalProjects: projects.length,
      todaysLabour: 0,
      materialsUsed: 0,
      machineryActive: 0,
    }),
    [projects.length],
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Dashboard</Text>
        <Text style={styles.sub}>Today’s overview</Text>

        <View style={styles.grid}>
          <GradientCard colors={['#1b5e20', '#66bb6a']} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="briefcase-check" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Total Projects</Text>
            </View>
            <Text style={styles.cardValue}>{stats.totalProjects}</Text>
          </GradientCard>

          <GradientCard colors={['#0d47a1', '#42a5f5']} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="account-group" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Today’s Labour</Text>
            </View>
            <Text style={styles.cardValue}>{stats.todaysLabour}</Text>
          </GradientCard>

          <GradientCard colors={['#4a148c', '#ab47bc']} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="cube-outline" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Materials Used</Text>
            </View>
            <Text style={styles.cardValue}>{stats.materialsUsed}</Text>
          </GradientCard>

          <GradientCard colors={['#e65100', '#ffb74d']} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="excavator" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Machinery Active</Text>
            </View>
            <Text style={styles.cardValue}>{stats.machineryActive}</Text>
          </GradientCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 28 },
  h1: { fontSize: 28, fontWeight: '800', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700' },
  cardValue: { marginTop: 10, color: '#fff', fontSize: 28, fontWeight: '900' },
});

