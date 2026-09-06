import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenContainer from '../../components/ScreenContainer';
import { useAppStore } from '../../store/useAppStore';
import { COLORS } from '../../constants/brand';

const TOGGLES = [
  { key: 'shipment' },
  { key: 'marketing' },
  { key: 'service' },
];

export default function NotificationSettingsScreen() {
  const { t } = useTranslation();
  const notifPrefs = useAppStore((s) => s.notifPrefs);
  const setNotifPrefs = useAppStore((s) => s.setNotifPrefs);

  function handleToggle(key, value) {
    setNotifPrefs({ ...notifPrefs, [key]: value });
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.card}>
          {TOGGLES.map((item, index) => (
            <View
              key={item.key}
              style={[styles.row, index < TOGGLES.length - 1 && styles.rowBorder]}
            >
              <Text style={styles.label}>{t(`notifSettings.${item.key}`)}</Text>
              <Switch
                value={!!notifPrefs[item.key]}
                onValueChange={(value) => handleToggle(item.key, value)}
                trackColor={{ true: COLORS.blue, false: COLORS.border }}
              />
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, minHeight: 48 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
});
