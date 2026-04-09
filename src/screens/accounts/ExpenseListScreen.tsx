import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import type { ProjectsStackParamList } from '../../navigation/types';
import { colors } from '../../theme/theme';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ExpenseList'>;

function formatINR(value: number) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
  }
}

export function ExpenseListScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { getLedger } = useApp();

  const ledger = getLedger(projectId);
  const totalExpenses = useMemo(() => ledger.expenses.reduce((sum, e) => sum + e.amount, 0), [ledger.expenses]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>Expenses</Text>
          <Text style={styles.sub}>{ledger.expenses.length} entries • {formatINR(totalExpenses)}</Text>
        </View>

        <FlatList
          data={ledger.expenses}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('ExpenseDetails', { projectId, expense: item })}
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name="receipt" size={20} color="#fff" />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub2}>
                    {item.type} • {new Date(item.dateIso).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatINR(item.amount)}</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="cash-remove" size={32} color="rgba(233,242,242,0.7)" />
              <Text style={styles.emptyTitle}>No expenses yet</Text>
              <Text style={styles.emptyText}>Tap “Add Expense” from Accounts to create the first entry.</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 4 },
  h1: { color: colors.text, fontSize: 24, fontWeight: '900' },
  sub: { marginTop: 6, color: colors.mutedText },
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
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(239,83,80,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meta: { flex: 1 },
  name: { color: colors.text, fontSize: 15, fontWeight: '900' },
  sub2: { marginTop: 3, color: colors.mutedText, fontSize: 12 },
  amount: { color: '#fff', fontSize: 14, fontWeight: '900' },
  empty: {
    marginTop: 24,
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.62)',
  },
  emptyTitle: { marginTop: 10, color: colors.text, fontWeight: '900', fontSize: 16 },
  emptyText: { marginTop: 6, color: colors.mutedText, textAlign: 'center' },
});

