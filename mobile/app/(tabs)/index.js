import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';


import { COLORS } from '../../constants/brand';
import { DEMO_AWBS } from '../../constants/brand';
import { useAppConfig } from '../../hooks/useAppConfig';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [awb, setAwb] = useState('');
  const [logoError, setLogoError] = useState(false);
  
  // Fetch app configuration (which contains your logo and dynamic settings)
  const { data: config } = useAppConfig();

  function handleTrack(value) {
    const trimmed = (value || awb).trim();
    if (!trimmed) return;
    router.push(`/track/${trimmed.toUpperCase()}`);
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          {/* Logo with remote error fallback to local asset */}
          {config?.logo && !logoError ? (
            <Image 
              source={{ uri: config.logo }} 
              style={styles.logo} 
              resizeMode="contain" 
              onError={() => setLogoError(true)}
            />
          ) : config?.logo && logoError ? (
            <Image 
              source={require("../../assets/logo.png")} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.appName}>{t('home.title')}</Text>
          )}

          <TouchableOpacity 
            onPress={() => router.push('/more/language')} 
            accessibilityLabel={t('language.title')}
            style={styles.langButton}
          >
            <Ionicons name="globe-outline" size={22} color={COLORS.navy} />
          </TouchableOpacity>
        </View>

        <View style={styles.trackCard}>
          <TextInput
            style={styles.input}
            placeholder={t('home.trackPlaceholder')}
            placeholderTextColor={COLORS.muted}
            value={awb}
            onChangeText={setAwb}
            autoCapitalize="characters"
            returnKeyType="search"
            onSubmitEditing={() => handleTrack()}
          />
          <PrimaryButton title={t('home.trackButton')} onPress={() => handleTrack()} style={{ marginTop: 12 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.no_shipments')}</Text>
          <Text style={styles.demoHint}>{t('home.shipment_overview')}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, height: 36 },
  appName: { fontSize: 20, fontWeight: '800', color: COLORS.navy },
  logo: { width: 80, height: 80, resizeMode: 'contain' },
  langButton: { padding: 4 },
  trackCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  demoHint: { fontSize: 11, color: COLORS.muted, marginTop: 10, textAlign: 'center' },
  section: { marginTop: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.blue, fontWeight: '600' },
  recentChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  recentChipText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
});