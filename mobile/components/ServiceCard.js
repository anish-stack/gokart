import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

export default function ServiceCard({ service, onPress }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const title = service.title?.[lang] || service.title?.en;
  const description = service.description?.[lang] || service.description?.en;
  const buttonText = service.buttonText?.[lang] || service.buttonText?.en || 'Learn more';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={3}>{description}</Text>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL(service.externalUrl)}
      >
        <Text style={styles.linkText}>{buttonText} →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  description: { fontSize: 13, color: COLORS.muted, lineHeight: 18, marginBottom: 12 },
  linkButton: { alignSelf: 'flex-start' },
  linkText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },
});
