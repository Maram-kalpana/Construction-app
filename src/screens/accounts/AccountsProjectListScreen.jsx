import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';
import { useEffect, useState } from 'react';
import { getProjects } from '../../api/projectApi';

export function AccountsProjectListScreen({ navigation }) {
 const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(false);
useEffect(() => {
  fetchProjects();
}, []);

const fetchProjects = async () => {
  setLoading(true);
  try {
    const res = await getProjects();

    console.log("PROJECT API:", res.data);

    if (res?.data?.success) {
      setProjects(res.data.data);
    } else {
      setProjects([]);
    }

  } catch (err) {
    console.log("PROJECT ERROR:", err?.response?.data || err);
    setProjects([]);
  }
  setLoading(false);
};
if (loading) {
  return <Text style={{ textAlign: 'center' }}>Loading projects...</Text>;
}

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>Accounts</Text>
          <Text style={styles.sub}>Pick a project to view budget, expenses, and balance.</Text>
        </View>
    
        <FlatList
          data={projects}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('Accounts', { projectId: item.id })} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="bank" size={22} color="#2f86de" />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.loc}>{item.location}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.mutedText} />
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
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText, lineHeight: 18 },
  list: { padding: 16, paddingBottom: 28, gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(98,182,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  loc: { marginTop: 2, color: colors.mutedText, fontSize: 13 },
});
