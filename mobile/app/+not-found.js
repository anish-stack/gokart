import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔎</Text>
      <Text style={styles.title}>{t('notFoundScreen.title')}</Text>
      <Text style={styles.body}>{t('notFoundScreen.body')}</Text>
      <Link href="/" style={styles.link}>{t('nav.home')}</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: COLORS.bg },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  body: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 20 },
  link: { color: COLORS.blue, fontWeight: '700', fontSize: 14 },
});
