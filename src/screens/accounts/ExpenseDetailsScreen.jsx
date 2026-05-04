import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '../../components/GradientButton';
import { GradientCard } from '../../components/GradientCard';
import { ScreenContainer } from '../../components/ScreenContainer';
import { colors } from '../../theme/theme';

function formatINR(value) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
  }
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <MaterialCommunityIcons name={icon} size={18} color={colors.text} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function ExpenseDetailsScreen({ route, navigation }) {
  const { projectId, expense } = route.params;
 const dateLabel = useMemo(() => {
  if (!expense?.dateIso) return 'No date';
  return new Date(expense.dateIso).toLocaleString();
}, [expense]);

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.h1}>Expense details</Text>
        <Text style={styles.sub}>Project: {projectId}</Text>

        <GradientCard colors={[colors.expenseStart, colors.expenseEnd]} style={styles.hero}>
          <View style={styles.heroTop}>
            <MaterialCommunityIcons name="cash-minus" size={22} color="#fff" />
            <Text style={styles.heroLabel}>{expense.type}</Text>
          </View>
          <Text style={styles.heroTitle}>{expense.name}</Text>
          <Text style={styles.heroAmount}>{formatINR(expense.amount)}</Text>
        </GradientCard>

        <View style={styles.detailCard}>
          <DetailRow icon="calendar" label="Date" value={dateLabel} />
          <DetailRow icon="tag" label="Type" value={expense.type} />
          <DetailRow icon="currency-inr" label="Amount" value={formatINR(expense.amount)} />
        </View>

        
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingBottom: 28 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 16 },
  hero: { marginBottom: 14 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroLabel: { color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: '900' },
  heroTitle: { marginTop: 10, color: '#fff', fontSize: 18, fontWeight: '900' },
  heroAmount: { marginTop: 8, color: '#fff', fontSize: 24, fontWeight: '900' },
  detailCard: {
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#e5e7eb', // light border
  backgroundColor: '#ffffff', // ✅ white
  padding: 14,
  gap: 12,
},
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  rowIcon: {
  width: 32,
  height: 32,
  borderRadius: 12,
  backgroundColor: '#f3f4f6', // light gray
  alignItems: 'center',
  justifyContent: 'center',
},
  rowLabel: {
  color: '#6b7280', // muted gray
  fontWeight: '800',
},
  rowValue: {
  color: '#111827', // dark text
  fontWeight: '800',
  flex: 1,
  textAlign: 'right',
},
  actions: { marginTop: 14, gap: 12 },
});
