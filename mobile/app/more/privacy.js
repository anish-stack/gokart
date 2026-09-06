import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { useCmsPage } from '../../hooks/useCmsPage';
import { COLORS } from '../../constants/brand';

export default function PrivacyScreen() {
  const { i18n } = useTranslation();
  const { data, isLoading, isError, refetch } = useCmsPage('privacy-policy');

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  const body = data.body?.[i18n.language] || data.body?.en;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.body}>{body}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  body: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
});
