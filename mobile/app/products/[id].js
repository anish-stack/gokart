import { View, Text, ScrollView, Image, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import PrimaryButton from '../../components/PrimaryButton';
import { useProductDetail } from '../../hooks/useProducts';
import { COLORS } from '../../constants/brand';

export default function ProductDetailsScreen() {
  const { i18n, t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useProductDetail(id);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  const lang = i18n.language;
  const name = data.name?.[lang] || data.name?.en;
  const description = data.description?.[lang] || data.description?.en;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        {data.image ? (
          <Image source={{ uri: data.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{data.currency} {data.price}</Text>
          <Text style={styles.description}>{description}</Text>
          <PrimaryButton
            title={t('products.viewProduct')}
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
  image: { width: '100%', height: 220, borderRadius: 16, backgroundColor: COLORS.border, marginBottom: 16 },
  imagePlaceholder: {},
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.navy, marginBottom: 8 },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.blue, marginBottom: 14 },
  description: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
});
