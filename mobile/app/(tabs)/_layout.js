import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/brand';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: t('nav.products'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'car' : 'car-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="article"
        options={{
          title: t('nav.article'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="contact"
        options={{
          title: t('nav.contact'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'call' : 'call-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: t('nav.more'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'menu' : 'menu-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}