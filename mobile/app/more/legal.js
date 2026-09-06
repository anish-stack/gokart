import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { useCmsPage } from '../../hooks/useCmsPage';
import { COLORS, BRAND } from '../../constants/brand';

export default function LegalScreen() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, refetch } = useCmsPage('legal');

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  const cin = data.meta?.cin || BRAND.cin;
  const registeredOffice = data.meta?.registeredOffice || BRAND.registeredOffice;
  const mdName = data.meta?.mdName || BRAND.mdName;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('legal.cin')}</Text>
            <Text style={styles.value}>{cin}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('legal.registeredOffice')}</Text>
            <Text style={styles.value}>{registeredOffice}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('about.managingDirector')}</Text>
            <Text style={styles.value}>{mdName}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  row: { paddingVertical: 4 },
  label: { fontSize: 12, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  value: { fontSize: 15, color: COLORS.text, fontWeight: '600', lineHeight: 22 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
});
