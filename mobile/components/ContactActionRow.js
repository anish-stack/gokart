import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

function Action({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ContactActionRow({ contact }) {
  const { t } = useTranslation();
  if (!contact) return null;

  return (
    <View style={styles.row}>
      {!!contact.phone && (
        <Action label={t('contact.callUs')} onPress={() => Linking.openURL(`tel:${contact.phone}`)} />
      )}
      {!!contact.whatsapp && (
        <Action
          label={t('contact.whatsapp')}
          onPress={() => Linking.openURL(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`)}
        />
      )}
      {!!contact.email && (
        <Action label={t('contact.emailUs')} onPress={() => Linking.openURL(`mailto:${contact.email}`)} />
      )}
      {!!contact.address && (
        <Action
          label={t('contact.openMap')}
          onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  action: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  actionText: { color: COLORS.blue, fontWeight: '700', fontSize: 13 },
});
