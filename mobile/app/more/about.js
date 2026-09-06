import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { useCmsPage } from '../../hooks/useCmsPage';
import { COLORS, BRAND } from '../../constants/brand';

export default function AboutScreen() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, refetch } = useCmsPage('about-us');

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  const lang = i18n.language;
  const body = data.body?.[lang] || data.body?.en;
  const mdName = data.meta?.mdName || BRAND.mdName;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.divider} />
          <Text style={styles.mdLabel}>{t('about.managingDirector')}</Text>
          <Text style={styles.mdName}>{mdName}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  body: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  mdLabel: { fontSize: 12, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  mdName: { fontSize: 16, fontWeight: '700', color: COLORS.navy, marginTop: 4 },
});
