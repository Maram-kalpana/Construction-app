import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/theme';

export function AppTextField({
  label,
  value,
  onChangeText,
  style,
  inputStyle,
  multiline,
  numberOfLines,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable = true,
  placeholder,
  onBlur,
  labelColor,
  textColor,
  placeholderColor,
  borderColor,
  backgroundColor,
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor || 'rgba(35,63,95,0.38)'}
        onBlur={onBlur}
        style={[
          styles.input,
          borderColor ? { borderColor } : null,
          backgroundColor ? { backgroundColor } : null,
          textColor ? { color: textColor } : null,
          multiline && styles.multiline,
          !editable && styles.disabled,
          inputStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    color: '#24476d',
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(125,180,235,0.65)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#17324f',
    fontSize: 14,
    fontWeight: '600',
  },
  multiline: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
  disabled: {
    backgroundColor: 'rgba(239,247,255,0.92)',
    color: colors.mutedText,
  },
});
