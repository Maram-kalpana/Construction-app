import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';
import { getProjects } from "../../api/projectApi";

export function ProjectsListScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await getProjects();

      const data = res?.data?.data || [];
      setProjects(data);

    } catch (err) {
      console.log("Project API error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>

        {loading && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Loading projects...
          </Text>
        )}

        <FlatList
          data={projects}
          keyExtractor={(p) => p.id?.toString()}
          contentContainerStyle={styles.list}

          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('ProjectModules', { projectId: item.id })
              }
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="office-building" size={22} color="#1d78d8" />
                </View>

                <View style={styles.meta}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>{item.location}</Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.mutedText} />
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
    backgroundColor: 'rgba(255,255,255,0.92)',
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
    backgroundColor: 'rgba(45,127,218,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sub: { marginTop: 2, color: colors.mutedText, fontSize: 13 },
});
