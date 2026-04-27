import React from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useAudioStore } from '@/store/audioStore';

const TAB_BAR_HEIGHT = 49;

export default function MiniPlayer() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { nowPlaying, isPlaying, isLoading, pause, resume, stop, nextVerse, prevVerse } =
    useAudioStore();

  if (!nowPlaying) return null;

  const bottom = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { bottom, backgroundColor: c.primary, shadowColor: c.arabicText },
      ]}
    >
      <Pressable style={styles.info} onPress={() => router.push('/(tabs)/listen')}>
        <Text style={styles.surahName} numberOfLines={1}>
          {nowPlaying.surahName}
        </Text>
        <Text style={styles.verseMeta}>
          Verse {nowPlaying.verseNumber} / {nowPlaying.totalVerses}
        </Text>
      </Pressable>

      <View style={styles.controls}>
        <Pressable onPress={prevVerse} hitSlop={8}>
          <Ionicons name="play-skip-back" size={20} color={c.accent} />
        </Pressable>

        <Pressable onPress={isPlaying ? pause : resume} hitSlop={8}>
          {isLoading ? (
            <ActivityIndicator size="small" color={c.accent} />
          ) : (
            <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={34} color={c.accent} />
          )}
        </Pressable>

        <Pressable onPress={nextVerse} hitSlop={8}>
          <Ionicons name="play-skip-forward" size={20} color={c.accent} />
        </Pressable>

        <Pressable onPress={stop} hitSlop={8}>
          <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Theme.spacing.md,
    right: Theme.spacing.md,
    height: 58,
    borderRadius: Theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 100,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  surahName: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verseMeta: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
});
