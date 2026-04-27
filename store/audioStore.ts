import { create } from 'zustand';
import { AVPlaybackStatus } from 'expo-av';
import { audioService, verseAudioUrl, RECITERS, type ReciterId } from '@/services/audioService';

interface NowPlaying {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  totalVerses: number;
}

interface AudioState {
  nowPlaying: NowPlaying | null;
  isPlaying: boolean;
  isLoading: boolean;
  reciterId: ReciterId;
  durationMs: number;
  positionMs: number;

  play: (info: NowPlaying) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  nextVerse: () => Promise<void>;
  prevVerse: () => Promise<void>;
  setReciter: (id: ReciterId) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  nowPlaying: null,
  isPlaying: false,
  isLoading: false,
  reciterId: RECITERS[0].id,
  durationMs: 0,
  positionMs: 0,

  play: async (info) => {
    set({ isLoading: true, nowPlaying: info });
    const url = verseAudioUrl(info.surahNumber, info.verseNumber, get().reciterId);
    await audioService.load(url, (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      set({
        isPlaying: status.isPlaying,
        positionMs: status.positionMillis ?? 0,
        durationMs: status.durationMillis ?? 0,
        isLoading: false,
      });
      // Auto-advance to next verse when finished
      if (status.didJustFinish) {
        get().nextVerse();
      }
    });
    set({ isLoading: false, isPlaying: true });
  },

  pause: async () => {
    await audioService.pause();
    set({ isPlaying: false });
  },

  resume: async () => {
    await audioService.resume();
    set({ isPlaying: true });
  },

  stop: async () => {
    await audioService.stop();
    set({ nowPlaying: null, isPlaying: false, positionMs: 0, durationMs: 0 });
  },

  nextVerse: async () => {
    const { nowPlaying } = get();
    if (!nowPlaying) return;
    if (nowPlaying.verseNumber >= nowPlaying.totalVerses) return;
    await get().play({ ...nowPlaying, verseNumber: nowPlaying.verseNumber + 1 });
  },

  prevVerse: async () => {
    const { nowPlaying } = get();
    if (!nowPlaying) return;
    if (nowPlaying.verseNumber <= 1) return;
    await get().play({ ...nowPlaying, verseNumber: nowPlaying.verseNumber - 1 });
  },

  setReciter: (id) => set({ reciterId: id }),
}));
