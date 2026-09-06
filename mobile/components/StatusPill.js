import { View, Text, StyleSheet } from 'react-native';
import { STATUS_LABELS, STATUS_COLORS } from '../constants/statuses';

export default function StatusPill({ status }) {
  const color = STATUS_COLORS[status] || '#64748B';
  return (
    <View style={[styles.pill, { backgroundColor: `${color}22` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{STATUS_LABELS[status] || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '700' },
});
