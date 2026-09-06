import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/brand';
import { formatEta } from '../utils/formatters';

export default function ArticleCard({ article, onPress }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const title = article.title?.[lang] || article.title?.en;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Left Thumbnail Image */}
      {article.coverImage ? (
        <Image source={{ uri: article.coverImage }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="newspaper-outline" size={24} color={COLORS.muted} />
        </View>
      )}

      {/* Middle Text Content (Date & Title) */}
      <View style={styles.contentContainer}>
        {!!article.publishedAt && (
          <Text style={styles.date}>{formatEta(article.publishedAt)}</Text>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* Right Arrow Icon */}
      <View style={styles.arrowContainer}>
        <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  date: {
    fontSize: 11,
    color: '#8b3a3a', // Dark reddish tone like the screenshot date label
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
    lineHeight: 18,
  },
  arrowContainer: {
    paddingRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});