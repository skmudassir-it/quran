import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  addedAt: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bm: Omit<Bookmark, 'addedAt'>) => void;
  removeBookmark: (surahNumber: number, verseNumber: number) => void;
  isBookmarked: (surahNumber: number, verseNumber: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (bm) => {
        const exists = get().isBookmarked(bm.surahNumber, bm.verseNumber);
        if (exists) return;
        set((s) => ({ bookmarks: [{ ...bm, addedAt: Date.now() }, ...s.bookmarks] }));
      },

      removeBookmark: (surahNumber, verseNumber) => {
        set((s) => ({
          bookmarks: s.bookmarks.filter(
            (b) => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
          ),
        }));
      },

      isBookmarked: (surahNumber, verseNumber) =>
        get().bookmarks.some(
          (b) => b.surahNumber === surahNumber && b.verseNumber === verseNumber
        ),
    }),
    {
      name: 'quran-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
