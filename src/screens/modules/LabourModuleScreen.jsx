import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PressableCard } from '../../components/PressableCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';

export function LabourModuleScreen({ route, navigation }) {
  const { projectId } = route.params;

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.h1}>Labour Module</Text>
        <Text style={styles.sub}>Use separate screens for adding labour and viewing daily labour reports.</Text>

        <PressableCard onPress={() => navigation.navigate('LabourForm', { projectId })} gradientColors={['#238a4a', '#4cc17b']} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name="account-plus" size={24} color="#1f6f3f" />
            </View>
            <View style={styles.meta}>
              <Text style={styles.title}>Add Labour</Text>
              <Text style={styles.desc}>Create or find worker by phone, then add today entry.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="rgba(24,49,79,0.55)" />
          </View>
        </PressableCard>

        <PressableCard onPress={() => navigation.navigate('LabourList', { projectId })} gradientColors={['#2f86de', '#62b6ff']} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.icon}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#1d78d8" />
            </View>
            <View style={styles.meta}>
              <Text style={styles.title}>Daily Labour Report</Text>
              <Text style={styles.desc}>View and edit today labour report rows.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="rgba(24,49,79,0.55)" />
          </View>
        </PressableCard>

        <Pressable style={styles.note}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.mutedText} />
          <Text style={styles.noteText}>You can open each row to update counts, work details, and worker profile.</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { marginTop: 8, color: colors.mutedText, marginBottom: 18, lineHeight: 20 },
  card: { marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(45,127,218,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  title: { color: '#17324f', fontSize: 17, fontWeight: '900' },
  desc: { marginTop: 5, color: colors.mutedText, fontSize: 13, lineHeight: 18 },
  note: {
    marginTop: 6,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: colors.outline,
    flexDirection: 'row',
    gap: 10,
  },
  noteText: { flex: 1, color: colors.mutedText, fontSize: 13, lineHeight: 18 },
});

