import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message || t('common.errorGeneric')}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 14, color: COLORS.danger, textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: COLORS.blue, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 24 },
  buttonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
});
