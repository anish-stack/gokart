import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/brand';

export default function LoadingState({ label }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.blue} />
      <Text style={styles.text}>{label || t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
});
