import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/theme';

export function VendorsListScreen({ navigation }) {
  const { vendors } = useApp();
  const { user } = useAuth();

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.h1}>Vendors</Text>
          <Text style={styles.sub}>Suppliers, transporters, and hire parties.</Text>
        </View>
        <FlatList
          data={vendors}
          keyExtractor={(v) => v.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (user?.role === 'admin') navigation.navigate('VendorForm', { vendorId: item.id });
              }}
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={styles.icon}>
                  <MaterialCommunityIcons name="store" size={22} color="#2f86de" />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phone || '—'}</Text>
                  {item.category ? <Text style={styles.cat}>{item.category}</Text> : null}
                </View>
                {user?.role === 'admin' ? <MaterialCommunityIcons name="pencil" size={20} color={colors.mutedText} /> : null}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="truck-outline" size={36} color="rgba(233,242,242,0.5)" />
              <Text style={styles.emptyTitle}>No vendors yet</Text>
              <Text style={styles.emptyText}>Add your first supplier or partner.</Text>
            </View>
          }
        />
        {user?.role === 'admin' ? (
          <View style={styles.footer}>
            <GradientButton
              title="Add vendor"
              onPress={() => navigation.navigate('VendorForm', {})}
              colors={['#2f86de', '#62b6ff']}
              left={<MaterialCommunityIcons name="plus" size={18} color="#fff" />}
            />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 22, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText },
  list: { padding: 16, paddingBottom: 120, gap: 12 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(98,182,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '900' },
  phone: { marginTop: 4, color: colors.mutedText, fontSize: 13 },
  cat: { marginTop: 4, color: '#2f86de', fontSize: 12, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  emptyTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },
  footer: { position: 'absolute', left: 16, right: 16, bottom: 16 },
});
