import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { COLORS } from '../constants/brand';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const isOffline = useAppStore((s) => s.isOffline);

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{t('common.offlineBanner')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  text: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
  },
});
