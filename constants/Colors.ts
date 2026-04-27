const palette = {
  deepEmerald: '#0F4C3A',
  softGold: '#D4AF37',
  parchment: '#FDFBF7',
  pureWhite: '#FFFFFF',
  darkCharcoal: '#2D3748',
  deepInk: '#1A202C',
  separator: '#E8E0D0',
  darkBg: '#0D1F1A',
  darkSurface: '#1A2F26',
  darkText: '#E8E0D0',
  darkBorder: '#2A3F35',
  darkTint: '#2A8A68',
  darkTabDefault: '#557066',
};

const Colors = {
  light: {
    primary: palette.deepEmerald,
    accent: palette.softGold,
    background: palette.parchment,
    surface: palette.pureWhite,
    text: palette.darkCharcoal,
    arabicText: palette.deepInk,
    tint: palette.deepEmerald,
    tabIconDefault: '#9BA8A3',
    tabIconSelected: palette.deepEmerald,
    border: palette.separator,
    card: palette.pureWhite,
  },
  dark: {
    primary: '#1A6B52',
    accent: palette.softGold,
    background: palette.darkBg,
    surface: palette.darkSurface,
    text: palette.darkText,
    arabicText: '#F0EDE8',
    tint: palette.darkTint,
    tabIconDefault: palette.darkTabDefault,
    tabIconSelected: palette.darkTint,
    border: palette.darkBorder,
    card: palette.darkSurface,
  },
};

export default Colors;
