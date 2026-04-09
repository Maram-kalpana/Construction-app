import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

import { GradientButton } from '../../components/GradientButton';
import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import type { ProjectsStackParamList } from '../../navigation/types';
import { colors } from '../../theme/theme';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'Accounts'>;

function formatINR(value: number) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
  }
}

export function AccountsDashboardScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { getLedger, setTotalAmount, projects } = useApp();
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  const ledger = getLedger(projectId);
  const totalExpenses = useMemo(() => ledger.expenses.reduce((sum, e) => sum + e.amount, 0), [ledger.expenses]);
  const balance = ledger.totalAmount - totalExpenses;

  const [draftTotal, setDraftTotal] = useState(String(ledger.totalAmount));

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>Accounts</Text>
        <Text style={styles.sub}>{project ? `${project.name} • ${project.location}` : `Project ${projectId}`}</Text>

        <View style={styles.grid}>
          <GradientCard colors={[colors.totalStart, colors.totalEnd]} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="cash-plus" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Total Amount</Text>
            </View>
            <Text style={styles.cardValue}>{formatINR(ledger.totalAmount)}</Text>
          </GradientCard>

          <GradientCard colors={[colors.expenseStart, colors.expenseEnd]} style={styles.card}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="cash-minus" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Expenses</Text>
            </View>
            <Text style={styles.cardValue}>{formatINR(totalExpenses)}</Text>
          </GradientCard>

          <GradientCard colors={[colors.balanceStart, colors.balanceEnd]} style={styles.cardWide}>
            <View style={styles.cardTop}>
              <MaterialCommunityIcons name="wallet" size={22} color="#fff" />
              <Text style={styles.cardLabel}>Balance</Text>
            </View>
            <Text style={styles.cardValue}>{formatINR(balance)}</Text>
          </GradientCard>
        </View>

        <View style={styles.actions}>
          <GradientButton
            title="Add Expense"
            onPress={() => navigation.navigate('AddExpense', { projectId })}
            left={<MaterialCommunityIcons name="plus" size={18} color="#fff" />}
          />
          <GradientButton
            title="View Expenses"
            onPress={() => navigation.navigate('ExpenseList', { projectId })}
            colors={[colors.brandStart, colors.brandEnd]}
            left={<MaterialCommunityIcons name="format-list-bulleted" size={18} color="#fff" />}
          />
        </View>

        <View style={styles.totalEditor}>
          <Text style={styles.sectionTitle}>Total Amount Received</Text>
          <Text style={styles.sectionSub}>Update when Admin releases funds for this project.</Text>
          <TextInput
            label="Total Amount"
            value={draftTotal}
            onChangeText={setDraftTotal}
            mode="outlined"
            keyboardType="numeric"
            outlineStyle={styles.outline}
            style={styles.input}
            textColor={colors.text}
            theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
          />
          <GradientButton
            title="Save Total Amount"
            onPress={() => {
              const next = Number(draftTotal);
              if (!Number.isFinite(next) || next < 0) return;
              void setTotalAmount(projectId, next);
            }}
            colors={[colors.totalStart, colors.totalEnd]}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 28 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%' },
  cardWide: { width: '100%' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardLabel: { color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: '800' },
  cardValue: { marginTop: 10, color: '#fff', fontSize: 24, fontWeight: '900' },
  actions: { marginTop: 14, gap: 12 },
  totalEditor: {
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.78)',
    padding: 14,
  },
  sectionTitle: { color: colors.text, fontWeight: '900', fontSize: 16 },
  sectionSub: { marginTop: 6, color: colors.mutedText, marginBottom: 12 },
  input: { backgroundColor: 'transparent', marginBottom: 12 },
  outline: { borderRadius: 14 },
});

