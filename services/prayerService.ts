import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  CalculationParameters,
} from 'adhan';
import * as Notifications from 'expo-notifications';
import { Strings } from '@/constants/Strings';
import type { CalculationMethod as MethodKey } from '@/store/preferencesStore';

export interface PrayerTime {
  name: string;
  key: string;
  time: Date;
}

function getParams(method: MethodKey): CalculationParameters {
  switch (method) {
    case 'NorthAmerica': return CalculationMethod.NorthAmerica();
    case 'Egyptian': return CalculationMethod.Egyptian();
    case 'UmmAlQura': return CalculationMethod.UmmAlQura();
    case 'Dubai': return CalculationMethod.Dubai();
    case 'Turkey': return CalculationMethod.Turkey();
    default: return CalculationMethod.MuslimWorldLeague();
  }
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  date: Date,
  method: MethodKey
): PrayerTime[] {
  const coords = new Coordinates(latitude, longitude);
  const params = getParams(method);
  const times = new PrayerTimes(coords, date, params);

  return [
    { key: 'fajr', name: Strings.prayer_time_fajr, time: times.fajr },
    { key: 'dhuhr', name: Strings.prayer_time_dhuhr, time: times.dhuhr },
    { key: 'asr', name: Strings.prayer_time_asr, time: times.asr },
    { key: 'maghrib', name: Strings.prayer_time_maghrib, time: times.maghrib },
    { key: 'isha', name: Strings.prayer_time_isha, time: times.isha },
  ];
}

export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  return prayers.find((p) => p.time > now) ?? null;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAdhanNotifications(
  prayers: PrayerTime[],
  enabledKeys: Record<string, boolean>
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const prayer of prayers) {
    if (!enabledKeys[prayer.key]) continue;
    const triggerDate = prayer.time;
    if (triggerDate <= new Date()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: Strings.prayer_time_notification_title(prayer.name),
        body: Strings.prayer_time_notification_message(prayer.name),
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
    });
  }
}
