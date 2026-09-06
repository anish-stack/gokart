import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/brand';

export default function EmptyState({ title, subtitle, icon }) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 4, textAlign: 'center' },
});
