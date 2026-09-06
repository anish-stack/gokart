import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/brand';
import OfflineBanner from './OfflineBanner';

export default function ScreenContainer({ children, style }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingTop: insets.top,
          paddingBottom: insets.bottom, // Added to prevent home indicator overlap
        }, 
        style
      ]}
    >
      <OfflineBanner />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});