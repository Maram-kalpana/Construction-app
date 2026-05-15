import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { formatDateOnlyLocal, parseDateLocalYmd } from '../utils/dateOnly';

export function DatePickerField({ label = 'Date', value, onChange, style }) {
  const [show, setShow] = useState(false);

  const selectedDate = value ? parseDateLocalYmd(value) : new Date();
  const displayYmd = value ? formatDateOnlyLocal(parseDateLocalYmd(value)) : '';

  return (
    <View style={style}>
      {label ? <Text style={{ marginBottom: 6 }}>{label}</Text> : null}

      {/* FIELD */}
      <Pressable
        onPress={() => setShow(true)}
        style={{
          height: 48,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: '#ccc',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          justifyContent: 'space-between',
        }}
      >
        <Text>{value ? displayYmd : 'Select date'}</Text>

        <MaterialCommunityIcons name="calendar" size={20} color="#2563eb" />
      </Pressable>

      {/* REAL CALENDAR */}
      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            if (Platform.OS === 'android' && event?.type === 'dismissed') {
              setShow(false);
              return;
            }
            setShow(false);
            if (date) {
              onChange(formatDateOnlyLocal(date));
            }
          }}
        />
      )}
    </View>
  );
}