import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { I18nextProvider, useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

import i18n from '../i18n';
import { useAppStore } from '../store/useAppStore';
import { useRecentShipments } from '../store/useRecentShipments';
import { setupPushNotifications } from '../utils/pushNotifications';
import { fetchAppConfig } from '../api/config';
import LoadingState from '../components/LoadingState';
import MaintenanceScreen from '../components/MaintenanceScreen';
import ForceUpdateScreen from '../components/ForceUpdateScreen';
import { StatusBar } from 'react-native';

const CURRENT_APP_VERSION = '1.0.0';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function isVersionLower(current, minimum) {
  const c = current.split('.').map(Number);
  const m = minimum.split('.').map(Number);
  for (let i = 0; i < Math.max(c.length, m.length); i += 1) {
    const cv = c[i] || 0;
    const mv = m[i] || 0;
    if (cv < mv) return true;
    if (cv > mv) return false;
  }
  return false;
}

function RootNavigator() {
  const { t } = useTranslation();
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);
  const language = useAppStore((s) => s.language);
  const setDeviceId = useAppStore((s) => s.setDeviceId);
  const setOffline = useAppStore((s) => s.setOffline);
  const hydrateRecent = useRecentShipments((s) => s.hydrate);

  const [configState, setConfigState] = useState({ loading: true, config: null, error: false });

  const loadConfig = useCallback(async () => {
    setConfigState((prev) => ({ ...prev, loading: true }));
    try {
      const config = await fetchAppConfig();
      setConfigState({ loading: false, config, error: false });
    } catch (err) {
      // Offline/first-launch fallback: don't block the app on config fetch failure.
      setConfigState({ loading: false, config: null, error: true });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.all([hydrate(), hydrateRecent()]);
      loadConfig();
    })();
  }, []);

  useEffect(() => {
    if (hydrated) {
      i18n.changeLanguage(language);
    }
  }, [hydrated, language]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(!(state.isConnected && state.isInternetReachable !== false));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setupPushNotifications(language).then((result) => {
      if (result?.deviceId) setDeviceId(result.deviceId);
    });
  }, [hydrated]);

  if (!hydrated || configState.loading) {
    return <LoadingState />;
  }

  if (configState.config?.maintenanceMode) {
    return <MaintenanceScreen config={configState.config} onRetry={loadConfig} />;
  }

  if (configState.config && isVersionLower(CURRENT_APP_VERSION, configState.config.minimumAppVersion)) {
    return <ForceUpdateScreen config={configState.config} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="track/[awb]" options={{ headerShown: true, title: t('result.title') }} />
      <Stack.Screen name="track/[awb]/details" options={{ headerShown: true, title: t('result.viewDetails') }} />
      <Stack.Screen name="services/[id]" options={{ headerShown: true, title: t('services.title') }} />
      <Stack.Screen name="products/[id]" options={{ headerShown: true, title: t('products.title') }} />
      <Stack.Screen name="more/about" options={{ headerShown: true, title: t('about.title') }} />
      <Stack.Screen name="more/contact" options={{ headerShown: true, title: t('contact.title') }} />
      <Stack.Screen name="more/privacy" options={{ headerShown: true, title: t('privacy.title') }} />
      <Stack.Screen name="more/terms" options={{ headerShown: true, title: t('terms.title') }} />
      <Stack.Screen name="more/legal" options={{ headerShown: true, title: t('legal.title') }} />
      <Stack.Screen name="more/faq" options={{ headerShown: true, title: t('faq.title') }} />
      <Stack.Screen name="more/language" options={{ headerShown: true, title: t('language.title') }} />
      <Stack.Screen name="more/settings" options={{ headerShown: true, title: t('settings.title') }} />
      <Stack.Screen name="more/notifications" options={{ headerShown: true, title: t('notifSettings.title') }} />
      <Stack.Screen name="more/recent-shipments" options={{ headerShown: true, title: t('home.recentShipments') }} />
      <Stack.Screen name="+not-found" options={{ headerShown: true, title: t('notFoundScreen.title') }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
          </QueryClientProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
