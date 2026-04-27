import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Strings } from '@/constants/Strings';
import { Theme } from '@/constants/Theme';
import MiniPlayer from '@/components/MiniPlayer';
import { audioService } from '@/services/audioService';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color }: { name: IoniconsName; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  useEffect(() => {
    audioService.configure();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: c.tint,
          tabBarInactiveTintColor: c.tabIconDefault,
          tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, borderTopWidth: 1 },
          tabBarLabelStyle: { fontSize: Theme.fontSize.xs, fontWeight: '600' },
          headerStyle: { backgroundColor: c.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: Theme.fontSize.lg },
        }}
      >
        <Tabs.Screen
          name="quran"
          options={{
            title: Strings.nav_tab_quran,
            headerShown: false,
            tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="listen"
          options={{
            title: Strings.nav_tab_audio,
            tabBarIcon: ({ color }) => <TabIcon name="headset" color={color} />,
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: Strings.nav_tab_calendar,
            tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} />,
          }}
        />
        <Tabs.Screen
          name="prayers"
          options={{
            title: Strings.nav_tab_prayers,
            tabBarIcon: ({ color }) => <TabIcon name="alarm" color={color} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  );
}
