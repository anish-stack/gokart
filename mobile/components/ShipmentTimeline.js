import { View, Text, StyleSheet } from 'react-native';
import { STATUS_LABELS } from '../constants/statuses';
import { formatDate } from '../utils/formatters';
import { COLORS } from '../constants/brand';

function TimelineIcon({ state }) {
  if (state === 'done') return <Text style={[styles.icon, { color: COLORS.success }]}>✓</Text>;
  if (state === 'current') return <View style={styles.currentDot} />;
  return <View style={styles.pendingDot} />;
}

export default function ShipmentTimeline({ events = [] }) {
  return (
    <View>
      {events.map((event, index) => (
        <View key={`${event.status}-${index}`} style={styles.row}>
          <View style={styles.iconColumn}>
            <TimelineIcon state={event.state} />
            {index < events.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.content}>
            <Text style={[styles.status, event.state === 'pending' && styles.pendingText]}>
              {STATUS_LABELS[event.status] || event.status}
            </Text>
            {!!event.location && <Text style={styles.location}>{event.location}</Text>}
            {!!event.description && <Text style={styles.description}>{event.description}</Text>}
            {!!event.occurredAt && <Text style={styles.time}>{formatDate(event.occurredAt)}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  iconColumn: { width: 28, alignItems: 'center' },
  icon: { fontSize: 16, fontWeight: '900' },
  currentDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.blue },
  pendingDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.border },
  line: { width: 2, flex: 1, minHeight: 24, backgroundColor: COLORS.border, marginTop: 2 },
  content: { flex: 1, paddingBottom: 20, paddingLeft: 10 },
  status: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  pendingText: { color: COLORS.muted },
  location: { fontSize: 13, color: COLORS.text, marginTop: 2 },
  description: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  time: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
});
