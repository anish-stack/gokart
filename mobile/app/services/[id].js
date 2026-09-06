import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import PrimaryButton from '../../components/PrimaryButton';
import { useServiceDetail } from '../../hooks/useServices';
import { COLORS } from '../../constants/brand';

export default function ServiceDetailsScreen() {
  const { i18n, t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useServiceDetail(id);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  const lang = i18n.language;
  const title = data.title?.[lang] || data.title?.en;
  const description = data.description?.[lang] || data.description?.en;
  const buttonText = data.buttonText?.[lang] || data.buttonText?.en || t('services.learnMore');

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <PrimaryButton
            title={buttonText}
            onPress={() => Linking.openURL(data.externalUrl)}
            style={{ marginTop: 20 }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.navy, marginBottom: 12 },
  description: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
});
