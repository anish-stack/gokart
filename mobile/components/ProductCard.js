import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

export default function ProductCard({ product, onPress }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const name = product.name?.[lang] || product.name?.en;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{product.currency} {product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 6,
  },
  image: { width: '100%', height: 110, backgroundColor: COLORS.border },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { padding: 10 },
  name: { fontSize: 13, fontWeight: '600', color: COLORS.text, minHeight: 34 },
  price: { fontSize: 13, fontWeight: '700', color: COLORS.blue, marginTop: 4 },
});
