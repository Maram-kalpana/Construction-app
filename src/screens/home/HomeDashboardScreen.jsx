import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function HomeDashboardScreen({ navigation }) {
  const { projects, vendors, getDailyBundle, dateKey } = useApp();
  const today = dateKey();
  const stats = useMemo(() => {
    let labour = 0;
    projects.forEach((p) => {
      labour += getDailyBundle(p.id, today).labourEntries.length;
    });
    return {
      projects: projects.length,
      vendors: vendors.length,
      todaysLabour: labour,
    };
  }, [projects, vendors, getDailyBundle, today]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Home</Text>
        <Text style={styles.sub}>Choose a workspace — projects, vendors, or accounts.</Text>

        <Pressable onPress={() => navigation.navigate('ProjectsList')} style={styles.press}>
          <GradientCard colors={['#0f766e', '#14b8a6']} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="domain" size={26} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Projects</Text>
                <Text style={styles.cardMeta}>{stats.projects} active sites • {stats.todaysLabour} labour rows today</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="rgba(255,255,255,0.85)" />
            </View>
          </GradientCard>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('VendorsList')} style={styles.press}>
          <GradientCard colors={['#7c3aed', '#a78bfa']} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="truck-delivery" size={26} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Vendors</Text>
                <Text style={styles.cardMeta}>{stats.vendors} suppliers & partners on file</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="rgba(255,255,255,0.85)" />
            </View>
          </GradientCard>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('AccountsProjectList')} style={styles.press}>
          <GradientCard colors={['#b45309', '#f59e0b']} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="bank" size={26} color="#fff" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Accounts</Text>
                <Text style={styles.cardMeta}>Budget, expenses & balances per project</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="rgba(255,255,255,0.85)" />
            </View>
          </GradientCard>
        </Pressable>

        <View style={styles.footerNote}>
          <MaterialCommunityIcons name="information" size={18} color={colors.mutedText} />
          <Text style={styles.footerText}>Daily labour, machinery, materials and cement stock are logged inside each project.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 32 },
  h1: { fontSize: 30, fontWeight: '900', color: colors.text },
  sub: { marginTop: 8, color: colors.mutedText, marginBottom: 20, lineHeight: 20 },
  press: { marginBottom: 14 },
  card: { width: '100%' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cardMeta: { marginTop: 6, color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 18 },
  footerNote: { flexDirection: 'row', gap: 10, marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: 'rgba(11,18,19,0.55)', borderWidth: 1, borderColor: colors.outline },
  footerText: { flex: 1, color: colors.mutedText, fontSize: 13, lineHeight: 18 },
});
