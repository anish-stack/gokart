import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import { COLORS } from '../../constants/brand';

const ITEMS = [
  { key: 'articles', route: '/articles', icon: '📰' },
  { key: 'about', route: '/more/about', icon: 'ℹ️' },
  { key: 'contact', route: '/more/contact', icon: '📞' },
  { key: 'privacy', route: '/more/privacy', icon: '🔒' },
  { key: 'terms', route: '/more/terms', icon: '📄' },
  { key: 'legal', route: '/more/legal', icon: '⚖️' },
  { key: 'language', route: '/more/language', icon: '🌐' },
  { key: 'settings', route: '/more/settings', icon: '⚙️' },
  { key: 'notifications', route: '/more/notifications', icon: '🔔' },
];

export default function MoreScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('more.title')}</Text>
        <View style={styles.card}>
          {ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.row, index < ITEMS.length - 1 && styles.rowBorder]}
              onPress={() => router.push(item.route)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.label}>{t(`more.${item.key}`, item.key)}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.navy, marginBottom: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, minHeight: 48 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon: { fontSize: 18, marginRight: 12 },
  label: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  chevron: { fontSize: 20, color: COLORS.muted },
});
