import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import type { Verse } from '@/services/quranApi';

interface Props {
  verse: Verse;
  isHighlighted?: boolean;
  arabicFontSize?: number;
  showTranslation?: boolean;
  isPlaying?: boolean;
  isBookmarked?: boolean;
  onPlay?: () => void;
  onBookmark?: () => void;
}

export default function VerseItem({
  verse,
  isHighlighted = false,
  arabicFontSize = 28,
  showTranslation = true,
  isPlaying = false,
  isBookmarked = false,
  onPlay,
  onBookmark,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isHighlighted ? c.primary + '18' : 'transparent',
          borderBottomColor: c.border,
        },
      ]}
    >
      {/* Row: verse badge + actions */}
      <View style={styles.topRow}>
        <View style={[styles.ayahBadge, { borderColor: c.accent }]}>
          <Text style={[styles.ayahNumber, { color: c.accent }]}>{verse.numberInSurah}</Text>
        </View>

        <View style={styles.actions}>
          {onPlay && (
            <Pressable onPress={onPlay} hitSlop={8}>
              <Ionicons
                name={isHighlighted && isPlaying ? 'pause-circle' : 'play-circle'}
                size={24}
                color={isHighlighted ? c.primary : c.tabIconDefault}
              />
            </Pressable>
          )}
          {onBookmark && (
            <Pressable onPress={onBookmark} hitSlop={8}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? c.accent : c.tabIconDefault}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Arabic text */}
      <Text
        style={[
          styles.arabicText,
          { color: c.arabicText, fontSize: arabicFontSize, lineHeight: arabicFontSize * 2 },
        ]}
      >
        {verse.text}
      </Text>

      {/* Translation */}
      {showTranslation && verse.translation ? (
        <Text style={[styles.translation, { color: c.text }]}>{verse.translation}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  ayahBadge: {
    borderWidth: 1,
    borderRadius: Theme.radius.full,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumber: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '400',
    marginBottom: Theme.spacing.sm,
  },
  translation: {
    fontSize: Theme.fontSize.sm,
    lineHeight: Theme.lineHeight.text,
    textAlign: 'left',
    fontStyle: 'italic',
  },
});
