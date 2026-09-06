import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/brand';

export default function PrimaryButton({ title, onPress, loading, disabled, style, variant = 'primary' }) {
  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      style={[styles.button, isSecondary && styles.secondaryButton, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? COLORS.blue : COLORS.white} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.secondaryText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: { opacity: 0.6 },
  text: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  secondaryText: { color: COLORS.blue },
});
