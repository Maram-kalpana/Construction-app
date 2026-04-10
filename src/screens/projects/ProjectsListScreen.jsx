import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function ProjectsListScreen({ navigation }) {
  const { projects } = useApp();

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('ProjectModules', { projectId: item.id })} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="office-building" size={22} color="#fff" />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>{item.location}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 28, gap: 12 },
  card: {
    backgroundColor: 'rgba(11,18,19,0.82)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(125,211,252,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sub: { marginTop: 2, color: colors.mutedText, fontSize: 13 },
  statusPill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(31,111,120,0.45)',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  statusText: { color: colors.text, fontWeight: '700', fontSize: 12 },
});
