import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import EmptyState from '../../components/EmptyState';
import { useRecentShipments } from '../../store/useRecentShipments';
import { formatDate } from '../../utils/formatters';
import { COLORS } from '../../constants/brand';

export default function RecentShipmentsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const recent = useRecentShipments((s) => s.recent);
  const clear = useRecentShipments((s) => s.clear);

  function handleClear() {
    Alert.alert(t('home.clearHistory'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('home.clearHistory'), style: 'destructive', onPress: clear },
    ]);
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {recent.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>{t('home.clearHistory')}</Text>
          </TouchableOpacity>
        )}

        {recent.length === 0 ? (
          <EmptyState title={t('common.empty')} />
        ) : (
          <FlatList
            data={recent}
            keyExtractor={(item) => item.awb}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => router.push(`/track/${item.awb}`)}>
                <Text style={styles.awb}>{item.awb}</Text>
                <Text style={styles.date}>{formatDate(item.trackedAt)}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  clearButton: { alignSelf: 'flex-end', marginBottom: 12 },
  clearText: { color: COLORS.danger, fontWeight: '700', fontSize: 13 },
  list: { paddingBottom: 24 },
  row: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  awb: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  date: { fontSize: 12, color: COLORS.muted },
});
