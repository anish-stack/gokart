import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import ScreenContainer from '../../components/ScreenContainer';
import { useAppStore } from '../../store/useAppStore';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { COLORS } from '../../constants/brand';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const queryClient = useQueryClient();

  async function handleSelect(code) {
    if (code === language) return;
    await setLanguage(code);
    // Re-fetch CMS/services/products in the new language.
    queryClient.invalidateQueries({ queryKey: ['cms'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>{t('language.title')}</Text>
        <View style={styles.card}>
          <FlatList
            data={SUPPORTED_LANGUAGES}
            keyExtractor={(item) => item.code}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.row, index < SUPPORTED_LANGUAGES.length - 1 && styles.rowBorder]}
                onPress={() => handleSelect(item.code)}
              >
                <Text style={styles.label}>{item.label}</Text>
                {language === item.code && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.navy, marginBottom: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, minHeight: 48 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  check: { fontSize: 16, color: COLORS.blue, fontWeight: '800' },
});
