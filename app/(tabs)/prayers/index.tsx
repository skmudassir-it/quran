import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import Colors from '@/constants/Colors';
import { Strings } from '@/constants/Strings';
import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import {
  calculatePrayerTimes,
  getNextPrayer,
  requestNotificationPermission,
  scheduleAdhanNotifications,
  type PrayerTime,
} from '@/services/prayerService';
import { usePreferencesStore, type CalculationMethod } from '@/store/preferencesStore';

const PRAYER_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  fajr: 'partly-sunny-outline',
  dhuhr: 'sunny-outline',
  asr: 'cloud-outline',
  maghrib: 'sunset-outline',
  isha: 'moon-outline',
};

const CALC_METHODS: { key: CalculationMethod; label: string }[] = [
  { key: 'MuslimWorldLeague', label: 'Muslim World League' },
  { key: 'NorthAmerica', label: 'North America (ISNA)' },
  { key: 'Egyptian', label: 'Egyptian' },
  { key: 'UmmAlQura', label: "Umm Al-Qura (Saudi)" },
  { key: 'Dubai', label: 'Dubai' },
  { key: 'Turkey', label: 'Turkey' },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function useCountdown(target: Date | null): string {
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setLabel('Now'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLabel(`${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return label;
}

export default function PrayersScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);

  const { calculationMethod, setCalculationMethod, prayerNotifications, togglePrayerNotification } =
    usePreferencesStore();

  const nextPrayer = getNextPrayer(prayers);
  const countdown = useCountdown(nextPrayer?.time ?? null);

  const loadPrayers = useCallback(async () => {
    setLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(Strings.prayer_time_location_permission_req);
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const times = calculatePrayerTimes(
        loc.coords.latitude,
        loc.coords.longitude,
        new Date(),
        calculationMethod
      );
      setPrayers(times);

      const granted = await requestNotificationPermission();
      setNotifGranted(granted);
      if (granted) {
        await scheduleAdhanNotifications(times, prayerNotifications);
      }
    } catch (e: any) {
      setLocationError(e.message ?? 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, [calculationMethod]);

  useEffect(() => { loadPrayers(); }, [loadPrayers]);

  async function handleToggleNotif(key: string) {
    togglePrayerNotification(key);
    if (notifGranted && prayers.length) {
      const updated = { ...prayerNotifications, [key]: !prayerNotifications[key] };
      await scheduleAdhanNotifications(prayers, updated);
    }
  }

  const methodLabel = CALC_METHODS.find((m) => m.key === calculationMethod)?.label ?? calculationMethod;

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.container}>
      {/* Next Prayer Banner */}
      {nextPrayer && (
        <View style={[styles.nextPrayerBanner, { backgroundColor: c.primary }]}>
          <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
          <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
          <Text style={styles.nextPrayerTime}>{formatTime(nextPrayer.time)}</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      )}

      {/* Location error */}
      {locationError && (
        <View style={[styles.errorBanner, { borderColor: '#E53E3E', backgroundColor: '#FFF5F5' }]}>
          <Ionicons name="location-outline" size={18} color="#E53E3E" />
          <Text style={[styles.errorText, { color: '#E53E3E' }]}>{locationError}</Text>
        </View>
      )}

      {/* Calc method selector */}
      <Pressable
        style={[styles.methodRow, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => setShowMethodModal(true)}
      >
        <Ionicons name="calculator-outline" size={18} color={c.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.methodLabel, { color: c.text }]}>Calculation Method</Text>
          <Text style={[styles.methodValue, { color: c.tabIconDefault }]}>{methodLabel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={c.tabIconDefault} />
      </Pressable>

      {/* Prayer rows */}
      {loading ? (
        <ActivityIndicator size="large" color={c.primary} style={{ margin: Theme.spacing.xl }} />
      ) : (
        <View style={[styles.prayerList, { backgroundColor: c.card, borderColor: c.border }]}>
          {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key, i) => {
            const prayer = prayers.find((p) => p.key === key);
            const isNext = nextPrayer?.key === key;
            return (
              <View
                key={key}
                style={[
                  styles.prayerRow,
                  { borderBottomColor: c.border },
                  i === 4 && styles.prayerRowLast,
                  isNext && { backgroundColor: c.primary + '12' },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: isNext ? c.primary : c.primary + '18' }]}>
                  <Ionicons
                    name={PRAYER_ICONS[key]}
                    size={20}
                    color={isNext ? '#FFF' : c.primary}
                  />
                </View>
                <Text style={[styles.prayerName, { color: c.text }]}>
                  {Strings[`prayer_time_${key}` as keyof typeof Strings] as string}
                </Text>
                {isNext && (
                  <View style={[styles.nextBadge, { backgroundColor: c.accent }]}>
                    <Text style={styles.nextBadgeText}>NEXT</Text>
                  </View>
                )}
                <Text style={[styles.prayerTimeText, { color: prayer ? c.text : c.tabIconDefault }]}>
                  {prayer ? formatTime(prayer.time) : '—'}
                </Text>
                <Switch
                  value={!!prayerNotifications[key]}
                  onValueChange={() => handleToggleNotif(key)}
                  trackColor={{ false: c.border, true: c.primary }}
                  thumbColor="#FFF"
                />
              </View>
            );
          })}
        </View>
      )}

      {/* Refresh */}
      <Pressable
        style={[styles.refreshBtn, { borderColor: c.primary }]}
        onPress={loadPrayers}
        disabled={loading}
      >
        <Ionicons name="refresh" size={16} color={c.primary} />
        <Text style={[styles.refreshText, { color: c.primary }]}>Refresh Prayer Times</Text>
      </Pressable>

      {/* Calculation Method Modal */}
      <Modal
        visible={showMethodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMethodModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMethodModal(false)}>
          <View style={[styles.modalSheet, { backgroundColor: c.surface }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Calculation Method</Text>
            {CALC_METHODS.map((m) => (
              <Pressable
                key={m.key}
                style={[
                  styles.methodOption,
                  { borderBottomColor: c.border },
                  calculationMethod === m.key && { backgroundColor: c.primary + '15' },
                ]}
                onPress={() => { setCalculationMethod(m.key); setShowMethodModal(false); }}
              >
                <Text style={[styles.methodOptionText, { color: c.text }]}>{m.label}</Text>
                {calculationMethod === m.key && (
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
  container: { paddingBottom: Theme.spacing.xxl },
  nextPrayerBanner: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    gap: 4,
  },
  nextPrayerLabel: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  nextPrayerName: { fontSize: Theme.fontSize.xxl, fontWeight: '700', color: '#FFF' },
  nextPrayerTime: { fontSize: Theme.fontSize.xl, color: 'rgba(255,255,255,0.9)' },
  countdown: { fontSize: Theme.fontSize.lg, color: '#D4AF37', fontWeight: '600', marginTop: 4 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Theme.spacing.sm,
    margin: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
  },
  errorText: { flex: 1, fontSize: Theme.fontSize.sm, lineHeight: 20 },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    margin: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
  },
  methodLabel: { fontSize: Theme.fontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  methodValue: { fontSize: Theme.fontSize.md, marginTop: 2 },
  prayerList: { marginHorizontal: Theme.spacing.md, borderRadius: Theme.radius.md, borderWidth: 1, overflow: 'hidden' },
  prayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Theme.spacing.sm,
  },
  prayerRowLast: { borderBottomWidth: 0 },
  iconWrap: { width: 38, height: 38, borderRadius: Theme.radius.md, alignItems: 'center', justifyContent: 'center' },
  prayerName: { flex: 1, fontSize: Theme.fontSize.md, fontWeight: '600' },
  nextBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  nextBadgeText: { fontSize: 10, fontWeight: '700', color: '#000' },
  prayerTimeText: { fontSize: Theme.fontSize.md, fontWeight: '500', marginRight: Theme.spacing.sm },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    margin: Theme.spacing.md,
    marginTop: Theme.spacing.lg,
    borderWidth: 1,
    borderRadius: Theme.radius.full,
    paddingVertical: Theme.spacing.sm + 2,
  },
  refreshText: { fontSize: Theme.fontSize.md, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: Theme.radius.lg, borderTopRightRadius: Theme.radius.lg, padding: Theme.spacing.lg, paddingBottom: Theme.spacing.xxl },
  modalTitle: { fontSize: Theme.fontSize.lg, fontWeight: '700', marginBottom: Theme.spacing.sm },
  methodOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: Theme.spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  methodOptionText: { flex: 1, fontSize: Theme.fontSize.md },
});
