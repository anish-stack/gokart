import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../../components/ScreenContainer';
import LoadingState from '../../../components/LoadingState';
import ErrorState from '../../../components/ErrorState';
import StatusPill from '../../../components/StatusPill';
import { useTrackShipment } from '../../../hooks/useTracking';
import { formatDate, formatEta } from '../../../utils/formatters';
import { COLORS } from '../../../constants/brand';

const SUCCESS = COLORS.success || '#16a34a';
const DANGER = COLORS.danger || '#dc2626';
const ACCENT = COLORS.primary || COLORS.navy;
const EMPTY = '—';

// lifecycle order — timeline isi hisaab se sort hoga (API ke galat timestamps ke bawajood)
const STAGE_RANK = {
  BOOKED: 1,
  ASSIGNED: 2,
  RECEIVED: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  FAILED_DELIVERY: 6,
  RTO_IN_TRANSIT: 7,
  RTO: 8,
  RETURNED: 9,
  DELIVERED: 10,
  UNKNOWN: 0,
};

const UNIT_SHORT = { gram: 'g', grams: 'g', kg: 'kg', kilogram: 'kg' };

const has = (v) => v !== null && v !== undefined && v !== '';
const show = (v) => (has(v) ? String(v) : EMPTY);
const showDate = (v) => (has(v) ? formatDate(v) : EMPTY);

const formatPlace = (place) => {
  if (!place) return null;
  if (typeof place === 'string') return place;
  const text = [place.city || place.hub, place.state].filter(Boolean).join(', ');
  if (!text && !place.pincode) return null;
  return place.pincode ? `${text}${text ? ' - ' : ''}${place.pincode}` : text;
};

const formatWeight = (weight, unit) => {
  if (!has(weight)) return EMPTY;
  const u = UNIT_SHORT[String(unit || '').toLowerCase()] || unit || '';
  return `${weight} ${u}`.trim();
};

const formatDimensions = (d) => {
  if (!d || (!d.length && !d.width && !d.height)) return EMPTY;
  return `${d.length ?? '-'} × ${d.width ?? '-'} × ${d.height ?? '-'} cm`;
};

const sortEvents = (events = []) =>
  [...events].sort((a, b) => {
    const ra = STAGE_RANK[a.statusCode] ?? 0;
    const rb = STAGE_RANK[b.statusCode] ?? 0;
    if (ra !== rb) return rb - ra; // latest stage upar
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });

const eventColor = (code, isLatest) => {
  if (code === 'DELIVERED') return SUCCESS;
  if (['FAILED_DELIVERY', 'RTO', 'RTO_IN_TRANSIT', 'RETURNED'].includes(code)) return DANGER;
  return isLatest ? ACCENT : COLORS.muted;
};

function DetailRow({ label, value, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          value === EMPTY && styles.valueEmpty,
          highlight && { color: highlight },
        ]}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      {!!title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function RouteCard({ origin, destination, currentLocation, isDelivered, t }) {
  return (
    <View style={styles.routeBox}>
      <View style={styles.routeCol}>
        <Text style={styles.routeLabel}>{t('result.origin', { defaultValue: 'From' })}</Text>
        <Text style={styles.routeHub}>{origin?.hub || origin?.city || EMPTY}</Text>
        <Text style={styles.routeSub}>{formatPlace(origin) || EMPTY}</Text>
      </View>

      <Text style={styles.routeArrow}>→</Text>

      <View style={[styles.routeCol, styles.routeColRight]}>
        <Text style={styles.routeLabel}>{t('result.destination', { defaultValue: 'To' })}</Text>
        <Text style={styles.routeHub}>{destination?.hub || destination?.city || EMPTY}</Text>
        <Text style={[styles.routeSub, styles.textRight]}>{formatPlace(destination) || EMPTY}</Text>
      </View>

      <View style={styles.currentBox}>
        <Text style={styles.currentText}>
          {isDelivered ? '✅ ' : '📍 '}
          {t('result.currentLocation', { defaultValue: 'Current location' })}: {show(currentLocation)}
        </Text>
      </View>
    </View>
  );
}

function TimelineItem({ event, isLatest, isLast, t }) {
  const color = eventColor(event.statusCode, isLatest);

  return (
    <View style={styles.eventRow}>
      <View style={styles.eventRail}>
        <View style={[styles.dot, { backgroundColor: color, borderColor: color }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.eventBody}>
        <View style={styles.eventHead}>
          <Text style={[styles.eventStatus, isLatest && { color }]}>{show(event.status)}</Text>
          <Text style={styles.eventCode}>{show(event.statusCode)}</Text>
        </View>
        <Text style={styles.eventTime}>{showDate(event.time)}</Text>
        <Text style={styles.eventMeta}>
          {t('result.hub', { defaultValue: 'Hub' })}: {show(event.hub)}
          {'   '}
          {t('result.location', { defaultValue: 'Location' })}: {show(event.location)}
        </Text>
        <Text style={styles.eventMeta}>
          {t('result.remarks', { defaultValue: 'Remarks' })}: {show(event.remarks)}
        </Text>
      </View>
    </View>
  );
}

export default function ShipmentDetailsScreen() {
  const { t } = useTranslation();
  const { awb } = useLocalSearchParams();
  const { data, isLoading, isError, refetch, isRefetching } = useTrackShipment(awb);
  if (isLoading) return <LoadingState />;
  if (isError || !data) {
    return (
      <ScreenContainer>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  const events = sortEvents(data.events);
  const shipment = data.shipment || {};
  const receiver = data.receiver || {};
  const origin = data.origin || {};
  const destination = data.destination || {};

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={refetch} />}
      >
        {/* Summary */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.awb} selectable>{data.awb}</Text>
            <StatusPill status={data.status} />
          </View>

          <RouteCard
            origin={origin}
            destination={destination}
            currentLocation={data.currentLocation}
            isDelivered={data.isDelivered}
            t={t}
          />

          <DetailRow label={t('result.status', { defaultValue: 'Status' })} value={show(data.status)} />
          <DetailRow label={t('result.statusCode', { defaultValue: 'Status code' })} value={show(data.statusCode)} />
          <DetailRow
            label={t('result.delivered', { defaultValue: 'Delivered' })}
            value={data.isDelivered ? t('common.yes', { defaultValue: 'Yes' }) : t('common.no', { defaultValue: 'No' })}
            highlight={data.isDelivered ? SUCCESS : undefined}
          />
          <DetailRow label={t('result.courier', { defaultValue: 'Courier' })} value={show(data.courier)} />
          <DetailRow label={t('result.partner', { defaultValue: 'Delivery partner' })} value={show(data.courierPartner)} />
          <DetailRow label={t('result.bookingDate', { defaultValue: 'Booked on' })} value={showDate(data.bookingDate)} />
          <DetailRow
            label={t('result.eta', { defaultValue: 'Expected delivery' })}
            value={has(data.eta) ? formatEta(data.eta) : EMPTY}
          />
          <DetailRow
            label={t('result.deliveredAt', { defaultValue: 'Delivered on' })}
            value={showDate(data.deliveredAt)}
            highlight={data.deliveredAt ? SUCCESS : undefined}
          />
          <DetailRow label={t('result.lastUpdated', { defaultValue: 'Last updated' })} value={showDate(data.lastUpdated)} />
        </View>

        {/* Origin */}
        <Card title={t('result.originDetails', { defaultValue: 'Origin' })}>
          <DetailRow label={t('result.hub', { defaultValue: 'Hub' })} value={show(origin.hub)} />
          <DetailRow label={t('result.city', { defaultValue: 'City' })} value={show(origin.city)} />
          <DetailRow label={t('result.state', { defaultValue: 'State' })} value={show(origin.state)} />
          <DetailRow label={t('result.pincode', { defaultValue: 'Pincode' })} value={show(origin.pincode)} />
        </Card>

        {/* Destination */}
        <Card title={t('result.destinationDetails', { defaultValue: 'Destination' })}>
          <DetailRow label={t('result.hub', { defaultValue: 'Hub' })} value={show(destination.hub)} />
          <DetailRow label={t('result.city', { defaultValue: 'City' })} value={show(destination.city)} />
          <DetailRow label={t('result.state', { defaultValue: 'State' })} value={show(destination.state)} />
          <DetailRow label={t('result.pincode', { defaultValue: 'Pincode' })} value={show(destination.pincode)} />
        </Card>

        {/* Receiver */}
        <Card title={t('result.receiver', { defaultValue: 'Receiver' })}>
          <DetailRow label={t('result.name', { defaultValue: 'Name' })} value={show(receiver.name)} />
          <DetailRow label={t('result.mobile', { defaultValue: 'Mobile' })} value={show(receiver.mobile)} />
        </Card>

        {/* Shipment */}
        <Card title={t('result.shipmentDetails', { defaultValue: 'Shipment details' })}>
          <DetailRow label={t('result.content', { defaultValue: 'Content' })} value={show(shipment.content)} />
          <DetailRow label={t('result.deliveryType', { defaultValue: 'Delivery type' })} value={show(shipment.deliveryType)} />
          <DetailRow label={t('result.weight', { defaultValue: 'Weight' })} value={formatWeight(shipment.weight, shipment.weightUnit)} />
          <DetailRow label={t('result.dimensions', { defaultValue: 'Dimensions (L×W×H)' })} value={formatDimensions(shipment.dimensions)} />
          <DetailRow label={t('result.pieces', { defaultValue: 'Pieces' })} value={show(shipment.pieces)} />
          <DetailRow label={t('result.attempts', { defaultValue: 'Delivery attempts' })} value={show(shipment.deliveryAttempts)} />
        </Card>

        {/* Timeline */}
        <Card title={`${t('result.timeline', { defaultValue: 'Tracking history' })} (${events.length})`}>
          {events.length === 0 ? (
            <Text style={styles.emptyText}>{t('result.noEvents', { defaultValue: 'No updates yet.' })}</Text>
          ) : (
            events.map((event, index) => (
              <TimelineItem
                key={`${event.statusCode}-${event.time || index}`}
                event={event}
                isLatest={index === 0}
                isLast={index === events.length - 1}
                t={t}
              />
            ))
          )}
        </Card>
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
  awb: { fontSize: 18, fontWeight: '800', color: COLORS.navy, flexShrink: 1, marginRight: 8 },

  routeBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  routeCol: { flex: 1 },
  routeColRight: { alignItems: 'flex-end' },
  routeLabel: { fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  routeHub: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  routeSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  routeArrow: { fontSize: 20, color: COLORS.muted, marginHorizontal: 10 },
  textRight: { textAlign: 'right' },
  currentBox: {
    width: '100%',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  currentText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: 13, color: COLORS.muted, marginRight: 12 },
  value: { fontSize: 13, color: COLORS.text, fontWeight: '600', flexShrink: 1, maxWidth: '65%', textAlign: 'right' },
  valueEmpty: { color: COLORS.muted, fontWeight: '400' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  emptyText: { fontSize: 13, color: COLORS.muted },

  eventRow: { flexDirection: 'row' },
  eventRail: { width: 22, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, marginTop: 3 },
  line: { flex: 1, width: 2, backgroundColor: COLORS.border, marginVertical: 2 },
  eventBody: { flex: 1, paddingBottom: 18, paddingLeft: 8 },
  eventHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventStatus: { fontSize: 14, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  eventCode: { fontSize: 10, color: COLORS.muted, fontWeight: '600', marginLeft: 8 },
  eventTime: { fontSize: 12, color: COLORS.text, marginTop: 3 },
  eventMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});