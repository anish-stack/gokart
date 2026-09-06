import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import { useContactByPincode } from '../../hooks/useContactByPincode';
import { COLORS } from '../../constants/brand';

export default function Contact() {
  const { t } = useTranslation();

  const [pincode, setPincode] = useState('');
  const [searchPincode, setSearchPincode] = useState('');

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useContactByPincode(searchPincode);

  // API response can be:
  // { success: true, data: {...} }
  const contact = data?.data || data;

  function handleSearch() {
    const cleanPincode = pincode.trim();

    if (!cleanPincode) {
      Alert.alert(
        t('common.error', 'Error'),
        t('contact.enterPincode', 'Please enter a pincode.')
      );
      return;
    }

    if (!/^\d{6}$/.test(cleanPincode)) {
      Alert.alert(
        t('common.error', 'Error'),
        t(
          'contact.invalidPincode',
          'Please enter a valid 6-digit pincode.'
        )
      );
      return;
    }

    setSearchPincode(cleanPincode);
  }

  function handleCall() {
    if (!contact?.phone) return;

    Linking.openURL(`tel:${contact.phone}`).catch(() => {
      Alert.alert(
        t('common.error', 'Error'),
        'Unable to open phone app.'
      );
    });
  }

  function handleWhatsApp() {
    if (!contact?.whatsapp) return;

    const phone = contact.whatsapp.replace(/[^\d+]/g, '');

    Linking.openURL(`https://wa.me/${phone.replace('+', '')}`).catch(() => {
      Alert.alert(
        t('common.error', 'Error'),
        'Unable to open WhatsApp.'
      );
    });
  }

  function handleEmail() {
    if (!contact?.email) return;

    Linking.openURL(`mailto:${contact.email}`).catch(() => {
      Alert.alert(
        t('common.error', 'Error'),
        'Unable to open email app.'
      );
    });
  }

  function handleMap() {
    if (!contact?.address) return;

    const encodedAddress = encodeURIComponent(contact.address);

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    Linking.openURL(mapUrl).catch(() => {
      Alert.alert(
        t('common.error', 'Error'),
        'Unable to open maps.'
      );
    });
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('contact.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'contact.subtitle',
              'Find your nearest GO! Track Express support contact.'
            )}
          </Text>
        </View>

        {/* Pincode Search */}
        <View style={styles.searchCard}>
          <Text style={styles.inputLabel}>
            {t('contact.pincode')}
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              value={pincode}
              onChangeText={(text) => {
                const value = text.replace(/\D/g, '');
                setPincode(value.slice(0, 6));
              }}
              placeholder="Enter 6-digit pincode"
              placeholderTextColor={COLORS.muted}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              activeOpacity={0.8}
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.searchButtonText}>
                  {t('common.search')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Error */}
        {isError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              {t('common.errorGeneric')}
            </Text>

            <Text style={styles.errorText}>
              {error?.response?.data?.message ||
                t(
                  'contact.noContact',
                  'No contact information found for this pincode.'
                )}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={refetch}
            >
              <Text style={styles.retryText}>
                {t('common.retry')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contact Result */}
        {contact && !isError && (
          <View style={styles.contactCard}>
            {/* Contact Header */}
            <View style={styles.contactHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>
                  📍
                </Text>
              </View>

              <View style={styles.contactHeaderText}>
                <Text style={styles.supportLabel}>
                  {t('contact.supportContact')}
                </Text>

                <Text style={styles.contactName}>
                  {contact.contactName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Phone */}
            {contact.phone && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text>📞</Text>
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t('contact.phone')}
                  </Text>

                  <Text style={styles.detailValue}>
                    {contact.phone}
                  </Text>
                </View>
              </View>
            )}

            {/* Email */}
            {contact.email && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text>✉️</Text>
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t('contact.email')}
                  </Text>

                  <Text style={styles.detailValue}>
                    {contact.email}
                  </Text>
                </View>
              </View>
            )}

            {/* WhatsApp */}
            {contact.whatsapp && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text>💬</Text>
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t('contact.whatsapp')}
                  </Text>

                  <Text style={styles.detailValue}>
                    {contact.whatsapp}
                  </Text>
                </View>
              </View>
            )}

            {/* Address */}
            {contact.address && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text>🏠</Text>
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t('contact.address', 'Address')}
                  </Text>

                  <Text style={styles.detailValue}>
                    {contact.address}
                  </Text>
                </View>
              </View>
            )}

            {/* Working Hours */}
            {contact.workingHours && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text>🕐</Text>
                </View>

                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>
                    {t(
                      'contact.workingHours',
                      'Working Hours'
                    )}
                  </Text>

                  <Text style={styles.detailValue}>
                    {contact.workingHours}
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              {contact.phone && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleCall}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionIcon}>
                    📞
                  </Text>

                  <Text style={styles.actionText}>
                    {t('contact.callUs')}
                  </Text>
                </TouchableOpacity>
              )}

              {contact.whatsapp && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleWhatsApp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionIcon}>
                    💬
                  </Text>

                  <Text style={styles.actionText}>
                    {t('contact.whatsapp')}
                  </Text>
                </TouchableOpacity>
              )}

              {contact.email && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEmail}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionIcon}>
                    ✉️
                  </Text>

                  <Text style={styles.actionText}>
                    {t('contact.emailUs')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Map Button */}
            {contact.address && (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={handleMap}
                activeOpacity={0.8}
              >
                <Text style={styles.mapIcon}>
                  📍
                </Text>

                <Text style={styles.mapButtonText}>
                  {t('contact.openMap')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Initial State */}
        {!searchPincode && !isLoading && !isError && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📍
            </Text>

            <Text style={styles.emptyTitle}>
              {t(
                'contact.findSupport',
                'Find Support Near You'
              )}
            </Text>

            <Text style={styles.emptyText}>
              {t(
                'contact.findSupportBody',
                'Enter your 6-digit pincode to find the contact details for your area.'
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },

  searchCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#fff',
  },

  searchButton: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  errorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
  },

  retryButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: COLORS.blue,
  },

  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  contactCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 24,
  },

  contactHeaderText: {
    flex: 1,
  },

  supportLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 3,
  },

  contactName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  detailIcon: {
    width: 34,
    alignItems: 'center',
    marginRight: 8,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  actionButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  actionIcon: {
    fontSize: 17,
    marginBottom: 2,
  },

  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.blue,
  },

  mapButton: {
    marginTop: 10,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  mapButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 7,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
    textAlign: 'center',
  },
});