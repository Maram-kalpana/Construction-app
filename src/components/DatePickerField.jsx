import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export function DatePickerField({ label = 'Date', value, onChange, style }) {
  const [open, setOpen] = useState(false);
  const dates = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      return formatDate(d);
    });
  }, []);

  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#4A90E2" />
        <Text style={styles.value}>{value}</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Select date</Text>
            <ScrollView>
              {dates.map((d) => (
                <Pressable
                  key={d}
                  style={[styles.option, d === value && styles.optionActive]}
                  onPress={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{d}</Text>
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
  label: { marginBottom: 8, marginLeft: 4, color: '#24476d', fontSize: 13, fontWeight: '800' },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(125,180,235,0.65)',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: { color: '#17324f', fontSize: 15, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.28)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '55%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 14,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#17324f', marginBottom: 8 },
  option: { paddingVertical: 11, paddingHorizontal: 10, borderRadius: 10 },
  optionActive: { backgroundColor: '#eaf3ff' },
  optionText: { color: '#17324f', fontWeight: '700' },
});
