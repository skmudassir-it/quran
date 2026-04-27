const BASE_URL = 'https://api.alquran.cloud/v1';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  translation: string;
}

export interface SurahDetail {
  info: Surah;
  verses: Verse[];
}

export async function fetchSurahs(): Promise<Surah[]> {
  const response = await fetch(`${BASE_URL}/surah`);
  const json = await response.json();
  if (json.code !== 200) throw new Error('Failed to fetch surah list');
  return json.data as Surah[];
}

export async function fetchSurah(surahNumber: number): Promise<SurahDetail> {
  const response = await fetch(
    `${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,en.asad`
  );
  const json = await response.json();
  if (json.code !== 200) throw new Error(`Failed to fetch surah ${surahNumber}`);

  const arabicEdition = json.data[0];
  const englishEdition = json.data[1];

  const verses: Verse[] = arabicEdition.ayahs.map((ayah: any, i: number) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    translation: englishEdition.ayahs[i]?.text ?? '',
  }));

  return {
    info: {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      revelationType: arabicEdition.revelationType,
    },
    verses,
  };
}
