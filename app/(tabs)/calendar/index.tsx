import React, { useMemo, useState } from 'react';
import {
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
import {
  toHijri,
  formatHijri,
  getUpcomingEvents,
  HIJRI_MONTHS,
  ISLAMIC_EVENTS,
} from '@/utils/hijri';

const DAYS_HEADER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export default function CalendarScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const today = new Date();
  const [viewDate, setViewDate] = useState(today);

  const todayHijri = useMemo(() => toHijri(today), []);
  const viewHijri = useMemo(() => toHijri(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)), [viewDate]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(todayHijri), [todayHijri]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth() + 1;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function isEventDay(day: number): boolean {
    const h = toHijri(new Date(viewYear, viewMonth - 1, day));
    return ISLAMIC_EVENTS.some((ev) => ev.month === h.month && ev.day === h.day);
  }

  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.container}>
      {/* Today's date header */}
      <View style={[styles.header, { backgroundColor: c.primary }]}>
        <Ionicons name="calendar" size={28} color={c.accent} />
        <Text style={styles.headerHijri}>{formatHijri(todayHijri)}</Text>
        <Text style={styles.headerGregorian}>
          {today.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      {/* Gregorian calendar grid */}
      <View style={[styles.calendarCard, { backgroundColor: c.card, borderColor: c.border }]}>
        {/* Month nav */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={c.text} />
          </Pressable>
          <View style={styles.monthTitle}>
            <Text style={[styles.monthName, { color: c.text }]}>{monthName} {viewYear}</Text>
            <Text style={[styles.hijriMonth, { color: c.primary }]}>
              {viewHijri.monthName} {viewHijri.year}
            </Text>
          </View>
          <Pressable onPress={nextMonth} hitSlop={10}>
            <Ionicons name="chevron-forward" size={22} color={c.text} />
          </Pressable>
        </View>

        {/* Day headers */}
        <View style={styles.gridRow}>
          {DAYS_HEADER.map((d) => (
            <Text key={d} style={[styles.dayHeader, { color: c.tabIconDefault }]}>{d}</Text>
          ))}
        </View>

        {/* Day cells */}
        <View style={styles.grid}>
          {Array.from({ length: firstDow }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              viewMonth === today.getMonth() + 1 &&
              viewYear === today.getFullYear();
            const hasEvent = isEventDay(day);
            return (
              <View key={day} style={styles.dayCell}>
                <View
                  style={[
                    styles.dayInner,
                    isToday && { backgroundColor: c.primary },
                  ]}
                >
                  <Text style={[styles.dayNum, { color: isToday ? '#FFF' : c.text }]}>{day}</Text>
                  {hasEvent && (
                    <View style={[styles.eventDot, { backgroundColor: isToday ? '#FFF' : c.accent }]} />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Upcoming Islamic Events */}
      <Text style={[styles.sectionTitle, { color: c.primary }]}>
        {Strings.calendar_upcoming_events_header}
      </Text>

      {upcomingEvents.map((ev, i) => (
        <View
          key={i}
          style={[styles.eventRow, { backgroundColor: c.card, borderColor: c.border }]}
        >
          <View style={[styles.eventDotLarge, { backgroundColor: c.accent }]} />
          <View style={styles.eventInfo}>
            <Text style={[styles.eventName, { color: c.text }]}>{ev.name}</Text>
            <Text style={[styles.eventDate, { color: c.tabIconDefault }]}>{ev.daysUntil}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: Theme.spacing.xxl },
  header: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
    gap: Theme.spacing.xs,
  },
  headerHijri: { fontSize: Theme.fontSize.xl, fontWeight: '700', color: '#FFF' },
  headerGregorian: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.75)' },

  calendarCard: {
    margin: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  monthTitle: { alignItems: 'center' },
  monthName: { fontSize: Theme.fontSize.lg, fontWeight: '700' },
  hijriMonth: { fontSize: Theme.fontSize.xs, marginTop: 2 },

  gridRow: { flexDirection: 'row', paddingHorizontal: Theme.spacing.xs },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: Theme.fontSize.xs, fontWeight: '600', paddingVertical: Theme.spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: Theme.spacing.xs },
  dayCell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 2 },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: Theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: { fontSize: Theme.fontSize.sm },
  eventDot: { width: 5, height: 5, borderRadius: 3, marginTop: 1 },

  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    marginHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
  },
  eventDotLarge: { width: 10, height: 10, borderRadius: Theme.radius.full },
  eventInfo: { flex: 1 },
  eventName: { fontSize: Theme.fontSize.md, fontWeight: '500' },
  eventDate: { fontSize: Theme.fontSize.xs, marginTop: 2 },
});
