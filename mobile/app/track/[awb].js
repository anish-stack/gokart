import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/ScreenContainer';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import StatusPill from '../../components/StatusPill';
import ShipmentTimeline from '../../components/ShipmentTimeline';

import { useTrackShipment } from '../../hooks/useTracking';
import { useRecentShipments } from '../../store/useRecentShipments';
import { formatDate, formatEta } from '../../utils/formatters';
import { COLORS } from '../../constants/brand';

function InfoRow({ label, value }) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>
        {String(value)}
      </Text>
    </View>
  );
}

export default function TrackingResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const params = useLocalSearchParams();

  const awb = Array.isArray(params.awb)
    ? params.awb[0]
    : params.awb;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTrackShipment(awb);

  const addRecent = useRecentShipments(
    (state) => state.addRecent
  );

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.awb) {
      addRecent(data.awb);
    }
  }, [data?.awb]);

  async function handleCopy() {
    try {
      const trackingNumber = data?.awb || awb;

      if (!trackingNumber) {
        return;
      }

      await Clipboard.setStringAsync(trackingNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      Alert.alert(
        t('common.error'),
        t('common.errorGeneric')
      );
    }
  }

  async function handleShare() {
    try {
      const trackingNumber = data?.awb || awb;

      if (!trackingNumber) {
        return;
      }

      await Share.share({
        message: `Track my GO! Track Express shipment ${trackingNumber}`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  }

  async function handleRefresh() {
    await refetch();
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    const notFound =
      error?.response?.status === 404;

    return (
      <ScreenContainer>
        <ErrorState
          message={
            notFound
              ? t('track.notFoundBody')
              : t('common.errorGeneric')
          }
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  if (!data) {
    return (
      <ScreenContainer>
        <ErrorState
          message={t('common.errorGeneric')}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>
          {t('result.title', 'Shipment Tracking')}
        </Text>

        <Text style={styles.pageSubtitle}>
          {t(
            'result.subtitle',
            'Track your shipment status and latest updates'
          )}
        </Text>
      </View>

      {/* Main Shipment Card */}
      <View style={styles.card}>
        <View style={styles.awbRow}>
          <View style={styles.awbContainer}>
            <Text style={styles.awbLabel}>
              {t('result.trackingNumber', 'Tracking Number')}
            </Text>

            <Text style={styles.awb}>
              {data.awb}
            </Text>
          </View>

          <StatusPill status={data.status} />
        </View>

        <View style={styles.divider} />

        <InfoRow
          label={t('result.courier')}
          value={data.courier}
        />

        <InfoRow
          label={t('result.origin')}
          value={data.origin}
        />

        <InfoRow
          label={t('result.destination')}
          value={data.destination}
        />

        <InfoRow
          label={t('result.currentLocation')}
          value={data.currentLocation}
        />

        {data.eta && (
          <InfoRow
            label={t('result.eta')}
            value={formatEta(data.eta)}
          />
        )}

        <InfoRow
          label={t('result.lastUpdated')}
          value={
            data.lastUpdated
              ? formatDate(data.lastUpdated)
              : null
          }
        />

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Ionicons
              name={copied ? 'checkmark-outline' : 'copy-outline'}
              size={18}
              color={COLORS.blue}
              style={styles.actionIcon}
            />

            <Text style={styles.actionText}>
              {copied
                ? t('common.copied')
                : t('common.copyAwb')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons
              name="share-outline"
              size={18}
              color={COLORS.blue}
              style={styles.actionIcon}
            />

            <Text style={styles.actionText}>
              {t('common.share')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
            disabled={isFetching}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={COLORS.blue}
              style={styles.actionIcon}
            />

            <Text style={styles.actionText}>
              {isFetching
                ? '...'
                : t('common.refresh')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.timelineCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('result.timeline')}
          </Text>

          {data.events?.length > 0 && (
            <Text style={styles.eventCount}>
              {data.events.length}
            </Text>
          )}
        </View>

        {data.events?.length > 0 ? (
          <ShipmentTimeline
            events={data.events}
          />
        ) : (
          <Text style={styles.noEvents}>
            {t(
              'result.noEvents',
              'No tracking updates available.'
            )}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.navy,
    marginBottom: 5,
  },

  pageSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 19,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },

  awbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  awbContainer: {
    flex: 1,
    marginRight: 12,
  },

  awbLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 5,
  },

  awb: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
  },

  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.muted,
  },

  infoValue: {
    flex: 1.4,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },

  actionButton: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  actionIcon: {
    marginBottom: 2,
  },

  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.blue,
  },

  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  eventCount: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.blue,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
  },

  noEvents: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
});