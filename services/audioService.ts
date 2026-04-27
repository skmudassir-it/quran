import { Audio, AVPlaybackStatus } from 'expo-av';

const BASE_URL = 'https://everyayah.com/data';

export const RECITERS = [
  { id: 'Alafasy_128kbps', name: 'Mishary Al-Afasy' },
  { id: 'AbdulBaset_Murattal_192kbps', name: 'Abdul Basit (Murattal)' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'Ghamadi_40kbps', name: 'Saad Al-Ghamdi' },
  { id: 'Minshawi_Murattal_128kbps', name: 'Muhammad Al-Minshawi' },
] as const;

export type ReciterId = (typeof RECITERS)[number]['id'];

function pad(n: number, digits: number) {
  return String(n).padStart(digits, '0');
}

export function verseAudioUrl(surah: number, verse: number, reciter: ReciterId): string {
  return `${BASE_URL}/${reciter}/${pad(surah, 3)}${pad(verse, 3)}.mp3`;
}

class AudioService {
  private sound: Audio.Sound | null = null;
  private configured = false;

  async configure() {
    if (this.configured) return;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    this.configured = true;
  }

  async load(
    url: string,
    onStatus: (status: AVPlaybackStatus) => void
  ): Promise<void> {
    await this.stop();
    await this.configure();
    const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    sound.setOnPlaybackStatusUpdate(onStatus);
    this.sound = sound;
  }

  async pause() {
    await this.sound?.pauseAsync();
  }

  async resume() {
    await this.sound?.playAsync();
  }

  async stop() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch {}
      this.sound = null;
    }
  }

  async seekTo(ms: number) {
    await this.sound?.setPositionAsync(ms);
  }
}

export const audioService = new AudioService();
