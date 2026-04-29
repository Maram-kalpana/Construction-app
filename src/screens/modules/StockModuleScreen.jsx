import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { DatePickerField } from '../../components/DatePickerField';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function StockModuleScreen({ route, navigation }) {
  const { projectId } = route.params;

  const { dateKey, stockEntries, vendors, deleteStockEntry } = useApp();

  const today = dateKey();

  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState('');

  const rows = stockEntries;

  const onDelete = (id) => {
    deleteStockEntry(id);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.wrap}>

        <View style={styles.header}>
          <Text style={styles.h1}>Stock</Text>
          <Text style={styles.sub}>
            Track stock inward & outward
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.mutedText} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
          />
        </View>

        <View style={styles.actions}>
          <DatePickerField
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ flex: 1 }}
          />

          <GradientButton
            title="Add Stock"
            onPress={() =>
              navigation.navigate('StockForm', { projectId })
            }
            colors={['#2f86de', '#62b6ff']}
            style={{ flex: 1 }}
          />
        </View>

        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const vendor = vendors.find(v => v.id === item.vendorId);

            return (
              <Pressable style={styles.card}>
                <View style={styles.row}>

                  <View style={styles.meta}>
                    <Text style={styles.name}>
                      {vendor?.name || 'Vendor'}
                    </Text>

                    <Text style={styles.metaSub}>
                      Open: {item.openBal || 0} | Received: {item.received || 0}
                    </Text>

                    <Text style={styles.metaSub}>
                      Balance: {item.bal || 0}
                    </Text>

                    {item.consumption?.map((c, i) => (
                      <Text key={i} style={styles.metaSub}>
                        {c.work} - {c.qty || 0}
                      </Text>
                    ))}

                    {item.remarks ? (
                      <Text style={styles.metaSub}>
                        Remarks: {item.remarks}
                      </Text>
                    ) : null}
                  </View>

                  <View style={{ gap: 10 }}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={18}
                      color={colors.mutedText}
                      onPress={() =>
                        navigation.navigate('StockForm', {
                          projectId,
                          entryId: item.id,
                        })
                      }
                    />

                    <MaterialCommunityIcons
                      name="delete"
                      size={18}
                      color="red"
                      onPress={() => onDelete(item.id)}
                    />
                  </View>

                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },

  header: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '900', color: colors.text },
  sub: { marginTop: 4, color: colors.mutedText },

  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  searchInput: { flex: 1, paddingVertical: 10 },

  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  list: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.outline,
    marginBottom: 10,
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  meta: { flex: 1 },

  name: { fontWeight: '900', fontSize: 15 },

  metaSub: { marginTop: 4, fontSize: 12, color: colors.mutedText },
});