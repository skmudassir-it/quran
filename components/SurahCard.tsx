import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import type { Surah } from '@/services/quranApi';

interface Props {
  surah: Surah;
  onPress: () => void;
}

export default function SurahCard({ surah, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: c.card, borderBottomColor: c.border, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.numberBadge, { backgroundColor: c.primary }]}>
        <Text style={[styles.numberText, { color: c.accent }]}>{surah.number}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.englishName, { color: c.text }]}>{surah.englishName}</Text>
        <Text style={[styles.subtitle, { color: c.tabIconDefault }]}>
          {surah.englishNameTranslation} · {surah.numberOfAyahs} verses ·{' '}
          {surah.revelationType}
        </Text>
      </View>

      <Text style={[styles.arabicName, { color: c.primary }]}>{surah.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Theme.spacing.md,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  englishName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: Theme.fontSize.xs,
  },
  arabicName: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '600',
  },
});
