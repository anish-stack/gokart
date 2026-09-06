import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/brand';
import PrimaryButton from './PrimaryButton';

export default function MaintenanceScreen({ config, onRetry }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>🛠️</Text>
      <Text style={styles.title}>{t('maintenance.title')}</Text>
      <Text style={styles.body}>{config?.maintenanceMessage || t('maintenance.body')}</Text>
      <PrimaryButton title={t('common.retry')} onPress={onRetry} style={{ marginTop: 24, width: 160 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#CBD5E1', textAlign: 'center', lineHeight: 20 },
});
