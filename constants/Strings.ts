export const Strings = {
  // Navigation
  nav_tab_quran: 'Quran',
  nav_tab_audio: 'Listen',
  nav_tab_calendar: 'Calendar',
  nav_tab_prayers: 'Prayers',
  btn_generic_save: 'Save',
  btn_generic_cancel: 'Cancel',
  loading_state_message: 'Loading...',

  // Quran Reader
  quran_reader_search_placeholder: 'Search by Surah, Juz, or Verse...',
  quran_reader_bookmark_added: 'Bookmark added successfully.',
  quran_reader_font_size_label: 'Adjust Font Size',
  quran_reader_surah_title: (name: string) => name,
  quran_reader_juz_title: (n: number) => `Juz ${n}`,
  quran_reader_ayah_number: (n: number) => `${n}`,

  // Audio
  audio_player_now_playing: 'Now Playing',
  audio_player_select_reciter: 'Select Reciter',
  audio_player_btn_play: 'Play',
  audio_player_btn_pause: 'Pause',
  audio_player_error_network: 'Unable to load audio. Please check your connection.',

  // Calendar
  calendar_title_hijri: 'Hijri Calendar',
  calendar_today_label: 'Today',
  calendar_upcoming_events_header: 'Upcoming Islamic Events',
  calendar_event_title: (name: string) => name,

  // Prayer Times
  prayer_time_fajr: 'Fajr',
  prayer_time_dhuhr: 'Dhuhr',
  prayer_time_asr: 'Asr',
  prayer_time_maghrib: 'Maghrib',
  prayer_time_isha: 'Isha',
  prayer_time_next_prayer_countdown: (prayer: string, time: string) =>
    `Time until ${prayer}: ${time}`,
  prayer_time_location_permission_req:
    'Please enable location services to calculate accurate prayer times.',
  prayer_time_notification_title: (prayer: string) => `Time for ${prayer}`,
  prayer_time_notification_message: (prayer: string) =>
    `It is time to offer the ${prayer} prayer in your location.`,
};
