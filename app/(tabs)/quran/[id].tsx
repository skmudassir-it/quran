import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import { Strings } from '@/constants/Strings';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import VerseItem from '@/components/VerseItem';
import { fetchSurah, type SurahDetail, type Verse } from '@/services/quranApi';
import { useAudioStore } from '@/store/audioStore';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { usePreferencesStore } from '@/store/preferencesStore';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
const FONT_STEPS = [22, 26, 30, 34, 38];

export default function SurahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const [data, setData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFontModal, setShowFontModal] = useState(false);

  const surahNumber = parseInt(id ?? '1', 10);

  const { nowPlaying, isPlaying, play, pause, resume } = useAudioStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const { arabicFontSize, setArabicFontSize, showTranslation, setLastRead } =
    usePreferencesStore();

  const isCurrentSurah =
    nowPlaying?.surahNumber === surahNumber;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSurah(surahNumber)
      .then((result) => {
        setData(result);
        navigation.setOptions({
          title: `${result.info.englishName} · ${result.info.name}`,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 12, marginRight: 8 }}>
              <Pressable onPress={() => setShowFontModal(true)} hitSlop={8}>
                <Ionicons name="text" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          ),
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [surahNumber]);

  function handleVersePlay(verse: Verse) {
    if (!data) return;
    const info = {
      surahNumber,
      surahName: data.info.englishName,
      verseNumber: verse.numberInSurah,
      totalVerses: data.info.numberOfAyahs,
    };
    if (isCurrentSurah && nowPlaying?.verseNumber === verse.numberInSurah) {
      isPlaying ? pause() : resume();
    } else {
      play(info);
      setLastRead({ surahNumber, surahName: data.info.englishName, verseNumber: verse.numberInSurah });
    }
  }

  function handleBookmark(verse: Verse) {
    if (!data) return;
    if (isBookmarked(surahNumber, verse.numberInSurah)) {
      removeBookmark(surahNumber, verse.numberInSurah);
    } else {
      addBookmark({ surahNumber, surahName: data.info.englishName, verseNumber: verse.numberInSurah });
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
        <Text style={[styles.statusText, { color: c.text }]}>{Strings.loading_state_message}</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={[styles.statusText, { color: '#E53E3E' }]}>{error ?? 'Something went wrong.'}</Text>
      </View>
    );
  }

  const showBismillah = surahNumber !== 9 && surahNumber !== 1;

  return (
    <>
      <FlatList
        data={data.verses}
        keyExtractor={(item) => String(item.number)}
        style={{ backgroundColor: c.background }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { backgroundColor: c.primary }]}>
              <Text style={styles.headerArabicName}>{data.info.name}</Text>
              <Text style={styles.headerEnglishName}>{data.info.englishName}</Text>
              <Text style={styles.headerMeta}>
                {data.info.englishNameTranslation} · {data.info.numberOfAyahs} verses ·{' '}
                {data.info.revelationType}
              </Text>
            </View>
            {showBismillah && (
              <View style={[styles.bismillahContainer, { borderBottomColor: c.border }]}>
                <Text style={[styles.bismillah, { color: c.primary, fontSize: arabicFontSize }]}>
                  {BISMILLAH}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const highlighted =
            isCurrentSurah && nowPlaying?.verseNumber === item.numberInSurah;
          const bookmarked = isBookmarked(surahNumber, item.numberInSurah);

          return (
            <VerseItem
              verse={item}
              isHighlighted={highlighted}
              arabicFontSize={arabicFontSize}
              showTranslation={showTranslation}
              isPlaying={highlighted && isPlaying}
              isBookmarked={bookmarked}
              onPlay={() => handleVersePlay(item)}
              onBookmark={() => handleBookmark(item)}
            />
          );
        }}
      />

      {/* Font size modal */}
      <Modal
        visible={showFontModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFontModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowFontModal(false)}>
          <View style={[styles.fontModal, { backgroundColor: c.surface }]}>
            <Text style={[styles.fontModalTitle, { color: c.text }]}>
              {Strings.quran_reader_font_size_label}
            </Text>
            <View style={styles.fontSteps}>
              {FONT_STEPS.map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.fontStep,
                    { borderColor: c.border },
                    arabicFontSize === size && { backgroundColor: c.primary, borderColor: c.primary },
                  ]}
                  onPress={() => {
                    setArabicFontSize(size);
                    setShowFontModal(false);
                  }}
                >
                  <Text style={{ fontSize: size * 0.5 + 8, color: arabicFontSize === size ? '#FFF' : c.text }}>
                    أ
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Theme.spacing.sm },
  statusText: { fontSize: Theme.fontSize.md },
  listContent: { paddingBottom: 140 },
  header: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  headerArabicName: { fontSize: Theme.fontSize.xxl + 6, color: '#FFFFFF', fontWeight: '600' },
  headerEnglishName: { fontSize: Theme.fontSize.xl, color: '#FFFFFF', fontWeight: '700' },
  headerMeta: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  bismillahContainer: {
    paddingVertical: Theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bismillah: { lineHeight: 68, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  fontModal: {
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    width: 300,
    gap: Theme.spacing.lg,
  },
  fontModalTitle: { fontSize: Theme.fontSize.lg, fontWeight: '700', textAlign: 'center' },
  fontSteps: { flexDirection: 'row', justifyContent: 'space-between' },
  fontStep: {
    width: 46,
    height: 46,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
