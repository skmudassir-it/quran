import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReciterId } from '@/services/audioService';
import { RECITERS } from '@/services/audioService';

export type CalculationMethod =
  | 'MuslimWorldLeague'
  | 'NorthAmerica'
  | 'Egyptian'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Turkey';

interface LastRead {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
}

interface PreferencesState {
  arabicFontSize: number;
  showTranslation: boolean;
  reciterId: ReciterId;
  calculationMethod: CalculationMethod;
  prayerNotifications: Record<string, boolean>;
  lastRead: LastRead | null;

  setArabicFontSize: (size: number) => void;
  setShowTranslation: (show: boolean) => void;
  setReciterId: (id: ReciterId) => void;
  setCalculationMethod: (method: CalculationMethod) => void;
  togglePrayerNotification: (prayer: string) => void;
  setLastRead: (read: LastRead) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      arabicFontSize: 28,
      showTranslation: true,
      reciterId: RECITERS[0].id,
      calculationMethod: 'MuslimWorldLeague',
      prayerNotifications: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      },
      lastRead: null,

      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setReciterId: (id) => set({ reciterId: id }),
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      togglePrayerNotification: (prayer) => {
        const current = get().prayerNotifications;
        set({ prayerNotifications: { ...current, [prayer]: !current[prayer] } });
      },
      setLastRead: (read) => set({ lastRead: read }),
    }),
    {
      name: 'quran-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
