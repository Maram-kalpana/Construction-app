import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

export function SelectField({ label, value, onChange, options, placeholder = 'Select', style }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? '',
    [options, value],
  );

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={[styles.valueText, !selectedLabel && styles.placeholder]} numberOfLines={1}>
          {selectedLabel || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#6b8fb5" />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={String(opt.value)}
                  style={[styles.option, value === opt.value && styles.optionActive]}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { marginBottom: 8, marginLeft: 4, color: '#24476d', fontSize: 13, fontWeight: '800' },
  input: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(125,180,235,0.65)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  valueText: { color: '#17324f', fontSize: 15, fontWeight: '600', flex: 1 },
  placeholder: { color: 'rgba(35,63,95,0.38)' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.28)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '55%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  option: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10 },
  optionActive: { backgroundColor: '#eaf3ff' },
  optionText: { color: colors.text, fontWeight: '700' },
});
