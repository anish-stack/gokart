import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import ContactActionRow from '../../components/ContactActionRow';
import { useContactByPincode } from '../../hooks/useContactByPincode';
import { submitContactForm } from '../../api/contact';
import { COLORS } from '../../constants/brand';

const EMPTY_FORM = { name: '', phone: '', email: '', pincode: '', city: '', state: '', country: 'India', message: '' };

export default function ContactScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const { data: contact, isLoading: contactLoading } = useContactByPincode(form.pincode, {
    city: form.city,
    state: form.state,
    country: form.country,
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      Alert.alert(t('common.errorGeneric'));
      return;
    }
    setSubmitting(true);
    try {
      await submitContactForm(form);
      Alert.alert(t('contact.success'));
      setForm(EMPTY_FORM);
    } catch (err) {
      Alert.alert(t('common.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        {form.pincode.length >= 5 && !contactLoading && contact && (
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>{t('contact.supportContact')}</Text>
            <Text style={styles.contactName}>{contact.contactName}</Text>
            {!!contact.address && <Text style={styles.contactMeta}>{contact.address}</Text>}
            {!!contact.workingHours && <Text style={styles.contactMeta}>{contact.workingHours}</Text>}
            <ContactActionRow contact={contact} />
          </View>
        )}

        <View style={styles.card}>
          <Field label={t('contact.name')} value={form.name} onChangeText={(v) => update('name', v)} />
          <Field label={t('contact.phone')} value={form.phone} onChangeText={(v) => update('phone', v)} keyboardType="phone-pad" />
          <Field label={t('contact.email')} value={form.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" />
          <Field label={t('contact.pincode')} value={form.pincode} onChangeText={(v) => update('pincode', v)} keyboardType="number-pad" />
          <Field label={t('contact.city')} value={form.city} onChangeText={(v) => update('city', v)} />
          <Field label={t('contact.state')} value={form.state} onChangeText={(v) => update('state', v)} />
          <Field label={t('contact.country')} value={form.country} onChangeText={(v) => update('country', v)} />
          <Field
            label={t('contact.message')}
            value={form.message}
            onChangeText={(v) => update('message', v)}
            multiline
          />
          <PrimaryButton title={t('contact.submit')} onPress={handleSubmit} loading={submitting} style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Field({ label, multiline, ...props }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholderTextColor={COLORS.muted}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  contactCard: {
    backgroundColor: '#EAF2FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7DBFF',
  },
  contactTitle: { fontSize: 12, color: COLORS.blue, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  contactName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  contactMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
});
