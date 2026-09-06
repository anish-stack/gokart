import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../constants/brand';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const language = useAppStore((s) => s.language);
  const currentLangLabel = SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || language;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => router.push('/more/recent-shipments')}>
            <Text style={styles.label}>{t('settings.recentShipments')}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={() => router.push('/more/language')}>
            <Text style={styles.label}>{t('settings.language')}</Text>
            <Text style={styles.valueMuted}>{currentLangLabel} ›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/more/notifications')}>
            <Text style={styles.label}>{t('settings.notifications')}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('settings.version')}: {APP_VERSION}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, minHeight: 48 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  chevron: { fontSize: 20, color: COLORS.muted },
  valueMuted: { fontSize: 13, color: COLORS.muted },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 12, color: COLORS.muted },
});
