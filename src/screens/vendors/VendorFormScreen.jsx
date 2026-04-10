import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { GradientButton } from '../../components/GradientButton';
import { ScreenContainer } from '../../components/ScreenContainer';
import { paperInputProps } from '../../components/paperInput';
import { useApp } from '../../contexts/AppContext';
import { colors } from '../../theme/theme';

export function VendorFormScreen({ route, navigation }) {
  const { vendorId } = route.params || {};
  const { vendors, saveVendor, deleteVendor } = useApp();
  const existing = useMemo(() => vendors.find((v) => v.id === vendorId) ?? null, [vendors, vendorId]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!existing) return;
    setName(existing.name ?? '');
    setPhone(existing.phone ?? '');
    setCategory(existing.category ?? '');
  }, [existing]);

  const onSave = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Missing', 'Enter vendor name.');
      return;
    }
    await saveVendor({ id: existing?.id, name, phone, category });
    navigation.goBack();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert('Delete vendor', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteVendor(existing.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TextInput
            label="Vendor name"
            value={name}
            onChangeText={setName}
            {...paperInputProps}
            style={styles.input}
            textColor={colors.text}
          />
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            {...paperInputProps}
            keyboardType="phone-pad"
            style={styles.input}
            textColor={colors.text}
          />
          <TextInput
            label="Category (cement, sand, hire, …)"
            value={category}
            onChangeText={setCategory}
            {...paperInputProps}
            style={styles.input}
            textColor={colors.text}
          />
          <GradientButton
            title={existing ? 'Update vendor' : 'Save vendor'}
            onPress={onSave}
            colors={['#7c3aed', '#a78bfa']}
            left={<MaterialCommunityIcons name="content-save" size={18} color="#fff" />}
          />
          {existing ? (
            <Pressable onPress={onDelete} style={styles.del}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#fca5a5" />
              <Text style={styles.delText}>Delete vendor</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  input: { marginBottom: 12 },
  del: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, justifyContent: 'center' },
  delText: { color: '#fca5a5', fontWeight: '800' },
});
