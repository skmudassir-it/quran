import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { Strings } from '@/constants/Strings';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useAudioStore } from '@/store/audioStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { RECITERS } from '@/services/audioService';

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export default function ListenScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [showReciterModal, setShowReciterModal] = useState(false);

  const {
    nowPlaying,
    isPlaying,
    isLoading,
    positionMs,
    durationMs,
    pause,
    resume,
    stop,
    nextVerse,
    prevVerse,
  } = useAudioStore();

  const { reciterId, setReciterId } = usePreferencesStore();
  const currentReciter = RECITERS.find((r) => r.id === reciterId);

  if (!nowPlaying) {
    return (
      <View style={[styles.empty, { backgroundColor: c.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: c.primary + '18' }]}>
          <Ionicons name="headset" size={56} color={c.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: c.text }]}>No audio playing</Text>
        <Text style={[styles.emptySubtitle, { color: c.tabIconDefault }]}>
          Open any Surah and tap the play button next to a verse to start listening.
        </Text>
      </View>
    );
  }

  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
    >
      {/* Artwork area */}
      <View style={[styles.artwork, { backgroundColor: c.primary }]}>
        <Text style={styles.artworkArabic}>﷽</Text>
        <Text style={styles.artworkSurah}>{nowPlaying.surahName}</Text>
        <Text style={styles.artworkVerse}>
          Verse {nowPlaying.verseNumber} of {nowPlaying.totalVerses}
        </Text>
      </View>

      <View style={styles.body}>
        {/* Reciter */}
        <Pressable
          style={[styles.reciterRow, { backgroundColor: c.card, borderColor: c.border }]}
          onPress={() => setShowReciterModal(true)}
        >
          <Ionicons name="person-outline" size={18} color={c.primary} />
          <Text style={[styles.reciterName, { color: c.text }]}>
            {currentReciter?.name ?? Strings.audio_player_select_reciter}
          </Text>
          <Ionicons name="chevron-down" size={16} color={c.tabIconDefault} />
        </Pressable>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={[styles.timeText, { color: c.tabIconDefault }]}>
            {formatTime(positionMs)}
          </Text>
          <View style={styles.sliderWrap}>
            <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: c.accent, width: `${progress * 100}%` },
                ]}
              />
            </View>
          </View>
          <Text style={[styles.timeText, { color: c.tabIconDefault }]}>
            {formatTime(durationMs)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable onPress={prevVerse} hitSlop={10}>
            <Ionicons name="play-skip-back" size={30} color={c.text} />
          </Pressable>

          <Pressable
            onPress={isPlaying ? pause : resume}
            style={[styles.playBtn, { backgroundColor: c.primary }]}
            hitSlop={10}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#FFFFFF" />
            )}
          </Pressable>

          <Pressable onPress={nextVerse} hitSlop={10}>
            <Ionicons name="play-skip-forward" size={30} color={c.text} />
          </Pressable>
        </View>

        {/* Stop */}
        <Pressable
          style={[styles.stopBtn, { borderColor: c.border }]}
          onPress={stop}
        >
          <Ionicons name="stop" size={16} color={c.tabIconDefault} />
          <Text style={[styles.stopText, { color: c.tabIconDefault }]}>Stop</Text>
        </Pressable>

        {/* Now Playing label */}
        <Text style={[styles.nowPlayingLabel, { color: c.tabIconDefault }]}>
          {Strings.audio_player_now_playing}
        </Text>
      </View>

      {/* Reciter Modal */}
      <Modal
        visible={showReciterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReciterModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowReciterModal(false)}>
          <View style={[styles.modalSheet, { backgroundColor: c.surface }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>
              {Strings.audio_player_select_reciter}
            </Text>
            {RECITERS.map((r) => (
              <Pressable
                key={r.id}
                style={[
                  styles.reciterOption,
                  { borderBottomColor: c.border },
                  reciterId === r.id && { backgroundColor: c.primary + '15' },
                ]}
                onPress={() => {
                  setReciterId(r.id);
                  setShowReciterModal(false);
                }}
              >
                <Text style={[styles.reciterOptionText, { color: c.text }]}>{r.name}</Text>
                {reciterId === r.id && (
                  <Ionicons name="checkmark" size={18} color={c.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: Theme.fontSize.xl, fontWeight: '700' },
  emptySubtitle: { fontSize: Theme.fontSize.md, textAlign: 'center', lineHeight: 22 },

  container: { paddingBottom: Theme.spacing.xxl },
  artwork: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
  },
  artworkArabic: { fontSize: 56, color: '#FFFFFF' },
  artworkSurah: { fontSize: Theme.fontSize.xxl, fontWeight: '700', color: '#FFFFFF' },
  artworkVerse: { fontSize: Theme.fontSize.md, color: 'rgba(255,255,255,0.75)' },

  body: { padding: Theme.spacing.lg, gap: Theme.spacing.lg },

  reciterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
  },
  reciterName: { flex: 1, fontSize: Theme.fontSize.md },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  timeText: { fontSize: Theme.fontSize.xs, width: 36 },
  sliderWrap: { flex: 1 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xxl,
  },
  playBtn: {
    width: 66,
    height: 66,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.xs,
    borderWidth: 1,
    borderRadius: Theme.radius.full,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    alignSelf: 'center',
  },
  stopText: { fontSize: Theme.fontSize.sm },
  nowPlayingLabel: { fontSize: Theme.fontSize.xs, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxl,
    gap: Theme.spacing.xs,
  },
  modalTitle: { fontSize: Theme.fontSize.lg, fontWeight: '700', marginBottom: Theme.spacing.sm },
  reciterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reciterOptionText: { flex: 1, fontSize: Theme.fontSize.md },
});
