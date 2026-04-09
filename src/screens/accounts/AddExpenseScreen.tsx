import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import type { ProjectsStackParamList } from '../../navigation/types';
import type { ExpenseType } from '../../types';
import { colors } from '../../theme/theme';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { user } = useAuth();
  const { addExpense, projects } = useApp();
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);

  const [name, setName] = useState('');
  const [type, setType] = useState<ExpenseType>('Labour');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const dateLabel = useMemo(() => new Date().toLocaleString(), []);
  const disabled = useMemo(() => name.trim().length < 2 || Number(amount) <= 0 || !Number.isFinite(Number(amount)), [name, amount]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Add Expense</Text>
          <Text style={styles.sub}>
            {project ? `${project.name} • ${project.location}` : `Project ${projectId}`} {'\n'}
            <Text style={styles.subMuted}>Date: {dateLabel}</Text>
          </Text>

          <View style={styles.formCard}>
            <TextInput
              label="Name / Party Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              outlineStyle={styles.outline}
              style={styles.input}
              textColor={colors.text}
              theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
            />

            <Text style={styles.label}>Type</Text>
            <SegmentedButtons
              value={type}
              onValueChange={(v) => setType(v as ExpenseType)}
              style={styles.segment}
              buttons={[
                { value: 'Labour', label: 'Labour' },
                { value: 'Material', label: 'Material' },
                { value: 'Machinery', label: 'Machinery' },
              ]}
              theme={{
                colors: {
                  secondaryContainer: 'rgba(66,165,245,0.22)',
                  onSecondaryContainer: colors.text,
                  outline: colors.outline,
                },
              }}
            />

            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              keyboardType="numeric"
              outlineStyle={styles.outline}
              style={styles.input}
              textColor={colors.text}
              theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="currency-inr" size={18} color={colors.mutedText} />} />}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              outlineStyle={styles.outline}
              style={styles.input}
              multiline
              numberOfLines={4}
              textColor={colors.text}
              theme={{ colors: { primary: '#42a5f5', outline: colors.outline, background: 'transparent' } }}
            />

            <GradientButton
              title="Save Expense"
              disabled={disabled}
              onPress={async () => {
                if (!user) return;
                const exp = await addExpense({
                  projectId,
                  managerId: user.id,
                  name,
                  type,
                  amount: Number(amount),
                  description,
                });
                navigation.replace('ExpenseDetails', { projectId, expense: exp });
              }}
              style={styles.btn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 28 },
  h1: { fontSize: 28, fontWeight: '900', color: colors.text },
  sub: { marginTop: 6, color: colors.mutedText, marginBottom: 16, lineHeight: 18 },
  subMuted: { color: 'rgba(233,242,242,0.55)' },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: 'rgba(11,18,19,0.78)',
    padding: 14,
  },
  input: { backgroundColor: 'transparent', marginBottom: 12 },
  outline: { borderRadius: 14 },
  label: { color: colors.text, fontWeight: '800', marginBottom: 10, marginTop: 4 },
  segment: { marginBottom: 12 },
  btn: { marginTop: 4 },
});

