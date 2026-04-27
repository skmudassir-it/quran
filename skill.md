# Skill Specification: Comprehensive Quran Application

## 1. Project Overview
This document outlines the technical and design specifications for developing a cross-platform (iOS and Android) Quran application using **Expo** and **React Native**. The application aims to provide a seamless, spiritual, and comprehensive experience for Muslims, integrating a digital Quran, audio recitations, prayer times, and a Hijri calendar.

---

## 2. Design System & Theme Specifications
The visual language of the application is designed to be calming, spiritual, and deeply connected to Islamic heritage, ensuring the interface does not distract from the reading experience.

### 2.1. Color Palette
*   **Primary Color (Deep Emerald):** `#0F4C3A` 
    *   *Usage:* App headers, active states, primary buttons, and major UI elements. Represents peace and Islamic tradition.
*   **Accent Color (Soft Gold):** `#D4AF37`
    *   *Usage:* Verse markers, Surah titles, active icons, and important highlights.
*   **Background Color (Parchment):** `#FDFBF7`
    *   *Usage:* Main application background and reading pane. Mimics the color of classic book paper to reduce eye strain.
*   **Surface Color (Pure White):** `#FFFFFF`
    *   *Usage:* Cards, modals, and dropdown menus.
*   **Primary Text (Dark Charcoal):** `#2D3748`
    *   *Usage:* Main readability text, translations, and UI copy. Softer than pure black for better contrast handling.
*   **Arabic Text Color (Deep Ink):** `#1A202C`
    *   *Usage:* Specifically for Uthmani script to ensure maximum legibility.

### 2.2. Typography
*   **UI/English Text:** System fonts (San Francisco for iOS, Roboto for Android) for native performance and familiarity.
*   **Arabic Text:** *KFGQPC Uthmanic Script HAFS* or similar standard Uthmani font, with dynamic sizing capabilities.

---

## 3. Core Modules & Functionalities

### 3.1. Quran Reader Module (The Mushaf Experience)
This module replicates the tactile experience of reading a physical Mushaf.

*   **Features:**
    *   **Book-like Presentation:** Utilizes `react-native-pager-view` or Expo-compatible swipe gestures to turn pages smoothly.
    *   **RTL Support:** Strict Right-to-Left (RTL) layout enforcement for the reading interface.
    *   **Navigation & Structure:** Hierarchical navigation (Index -> Juz/Surah -> Page/Verse).
    *   **Search & Filtering:** Fast indexing search by Surah name, Juz (Para) number, or specific Ayah (Verse) text.
    *   **Bookmarking:** Ability to save the last read position and custom verse bookmarks.
*   **UI/UX Considerations:** Distraction-free full-screen mode, adjustable font sizes, and a toggle for translation visibility.

### 3.2. Audio Recitation Module
An integrated audio experience that functions concurrently with the Quran reader.

*   **Features:**
    *   **Playback Controls:** Standard Play, Pause, Stop, Next Verse, and Previous Verse controls using `expo-av`.
    *   **Synchronization:** Visual highlighting of the specific Ayah currently being recited.
    *   **Reciter Selection:** Dropdown menu to choose from various renowned Qaris (Reciters).
    *   **Background Playback:** Audio continues playing when the screen is locked or the app is minimized.
*   **UI/UX Considerations:** A persistent mini-player docked at the bottom of the screen during navigation, expandable into a full-screen player.

### 3.3. Islamic Calendar Module
A functional Hijri calendar mapped to the Gregorian calendar.

*   **Features:**
    *   **Dual Display:** Toggle between standard Gregorian and Hijri dates.
    *   **Current Date Focus:** Prominent display of today's Hijri date upon opening the module.
    *   **Events Directory:** A scrollable list of significant Islamic events (e.g., Ramadan, Eid al-Fitr, Eid al-Adha, Ashura).
*   **UI/UX Considerations:** Clean grid layout for the month view, with dot indicators on dates containing significant events.

### 3.4. Adhan/Prayer Timings Module
A robust, location-aware prayer tracking system.

*   **Features:**
    *   **Location-Based Calculations:** Utilizes `expo-location` to fetch precise user coordinates (with fallback manual entry).
    *   **Calculation Methods:** Support for major calculation conventions (e.g., Muslim World League, ISNA, Umm Al-Qura).
    *   **Push Notifications:** Scheduled local push notifications using `expo-notifications` triggered at exact prayer times.
    *   **Audio Alerts:** Plays a high-quality Adhan sound file when a notification is triggered.
*   **UI/UX Considerations:** A dashboard displaying the next upcoming prayer with a live countdown timer. Visually distinct active/inactive toggle switches for individual prayer notifications (Fajr, Dhuhr, Asr, Maghrib, Isha).

---

## 4. Text Tags Dictionary (Localization / i18n)
To ensure consistency and ease of translation/localization, the following text tags must be used as variables in the codebase instead of hardcoded strings.

### 4.1. General & Navigation
*   `nav_tab_quran`: "Quran"
*   `nav_tab_audio`: "Listen"
*   `nav_tab_calendar`: "Calendar"
*   `nav_tab_prayers`: "Prayers"
*   `btn_generic_save`: "Save"
*   `btn_generic_cancel`: "Cancel"
*   `loading_state_message`: "Loading..."

### 4.2. Quran Reader Module
*   `quran_reader_surah_title`: "{surah_name}"
*   `quran_reader_juz_title`: "Juz {juz_number}"
*   `quran_reader_ayah_number`: "Ayah {ayah_number}"
*   `quran_reader_search_placeholder`: "Search by Surah, Juz, or Verse..."
*   `quran_reader_bookmark_added`: "Bookmark added successfully."
*   `quran_reader_font_size_label`: "Adjust Font Size"

### 4.3. Audio Recitation Module
*   `audio_player_now_playing`: "Now Playing"
*   `audio_player_select_reciter`: "Select Reciter"
*   `audio_player_btn_play`: "Play"
*   `audio_player_btn_pause`: "Pause"
*   `audio_player_error_network`: "Unable to load audio. Please check your connection."

### 4.4. Islamic Calendar Module
*   `calendar_title_hijri`: "Hijri Calendar"
*   `calendar_today_label`: "Today"
*   `calendar_event_title`: "{event_name}"
*   `calendar_upcoming_events_header`: "Upcoming Islamic Events"

### 4.5. Adhan/Prayer Timings Module
*   `prayer_time_fajr`: "Fajr"
*   `prayer_time_dhuhr`: "Dhuhr"
*   `prayer_time_asr`: "Asr"
*   `prayer_time_maghrib`: "Maghrib"
*   `prayer_time_isha`: "Isha"
*   `prayer_time_next_prayer_countdown`: "Time until {prayer_name}: {time_remaining}"
*   `prayer_time_location_permission_req`: "Please enable location services to calculate accurate prayer times."
*   `prayer_time_notification_title`: "Time for {prayer_name}"
*   `prayer_time_notification_message`: "It is time to offer the {prayer_name} prayer in your location."

---

## 5. Technical Stack & Expo Dependencies

To implement the functionalities above, the following Expo SDK packages are required:

*   **Core UI & Navigation:**
    *   `@react-navigation/native` (Bottom tabs, stack navigation)
    *   `react-native-reanimated` & `react-native-gesture-handler` (Smooth page turns and animations)
*   **Media & Hardware:**
    *   `expo-av` (For all audio playback and background audio configuration)
    *   `expo-location` (To fetch latitude/longitude for Adhan calculations)
    *   `expo-notifications` (For scheduling and handling local Adhan alerts)
*   **Data & State Management:**
    *   `adhan-js` or similar library (For offline prayer time mathematical calculations)
    *   `moment-hijri` (For Gregorian to Hijri calendar conversions)
    *   `AsyncStorage` / `Zustand` / `Redux` (For saving user preferences, bookmarks, and reciter choices)

## 6. Development Phasing
1.  **Phase 1:** Setup Expo environment, configure theme, implement navigation skeleton, and build the basic Quran reading UI (Text rendering, JSON parsing for verses).
2.  **Phase 2:** Integrate `expo-av`, sync audio with verses, and build the persistent media player.
3.  **Phase 3:** Implement `expo-location` and `adhan-js` for accurate local prayer times, followed by push notifications setup.
4.  **Phase 4:** Develop the Hijri calendar module.
5.  **Phase 5:** QA, UI/UX refinement, offline mode testing, and final app store preparations.
