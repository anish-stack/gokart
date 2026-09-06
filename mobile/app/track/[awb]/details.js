import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../../components/ScreenContainer';
import LoadingState from '../../../components/LoadingState';
import ErrorState from '../../../components/ErrorState';
import StatusPill from '../../../components/StatusPill';
import { useTrackShipment } from '../../../hooks/useTracking';
import { formatDate, formatEta } from '../../../utils/formatters';
import { COLORS } from '../../../constants/brand';

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ShipmentDetailsScreen() {
  const { t } = useTranslation();
  const { awb } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useTrackShipment(awb);
  console.log(data)
  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ScreenContainer><ErrorState onRetry={refetch} /></ScreenContainer>;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.awb}>{data.awb}</Text>
            <StatusPill status={data.status} />
          </View>
          <DetailRow label={t('result.courier')} value={data.courier} />
          <DetailRow label={t('result.origin')} value={data.origin} />
          <DetailRow label={t('result.destination')} value={data.destination} />
          <DetailRow label={t('result.currentLocation')} value={data.currentLocation} />
          {data.eta && <DetailRow label={t('result.eta')} value={formatEta(data.eta)} />}
          <DetailRow label={t('result.lastUpdated')} value={formatDate(data.lastUpdated)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('result.timeline')}</Text>
          {(data.events || []).map((event, index) => (
            <View key={`${event.status}-${index}`} style={styles.eventRow}>
              <Text style={styles.eventStatus}>{event.status}</Text>
              <Text style={styles.eventMeta}>{event.location} · {event.description}</Text>
              {!!event.occurredAt && <Text style={styles.eventTime}>{formatDate(event.occurredAt)}</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  awb: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 13, color: COLORS.muted },
  value: { fontSize: 13, color: COLORS.text, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  eventRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  eventStatus: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  eventMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  eventTime: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
});
