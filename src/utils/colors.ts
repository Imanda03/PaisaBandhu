import { useContext } from 'react';
import { ThemeContext, ThemeOptions } from '../context/ThemeProvider';

// Luxe Charcoal + Brushed Gold - high-end classic
export const COLORS = {
  primary: '#1E1E24',      // Charcoal
  primaryLight: '#2A2A30', // Surface / dark cards
  accent: '#C6A56B',       // Soft gold
  background: '#F4F4F6',   // Light gray
  surface: '#2A2A30',      // Dark cards
  textLight: '#F7F7F8',    // Light text on dark
  muted: '#9A9AA0',        // Muted
  border: '#E8E8EC',       // Subtle border
} as const;

const common = {
  WARNING: '#E5A854',
  ERROR: '#D45D5D',
  SUCCESS: '#5BA56B',
  PURPLE: '#1E1E24',
  PRIMARY: '#1E1E24',
  SECONDARY: '#C6A56B',
  PRICE_ERROR: '#D45D5D',
  WARNING_LIGHT: '#FDF8ED',
  ERROR_LIGHT: '#FDF2F2',
  SUCCESS_LIGHT: '#F0F9F1',
  DARK_PURPLE: '#1E1E24',
  DARK_PURPLE_2: '#2A2A30',
  LIGHT_PURPLE: '#C6A56B',
  INCOME_PIE: '#5BA56B',
  EXPENSE_PIE: '#D45D5D',
} as const;

export interface ThemeColors {
  SECONDARY: string;
  PRIMARY: string;
  BACKGROUND: string;
  TEXT: string;
  WARNING: string;
  WARNING_LIGHT: string;
  ERROR: string;
  ERROR_LIGHT: string;
  SUCCESS: string;
  SUCCESS_LIGHT: string;
  PURPLE: string;
  SHADOW: string;
  SHADOW_OPACITY: number;
  INPUT_BACKGROUND: string;
  PLACEHOLDER_COLOR: string;
  BORDER_COLOR: string;
  NAVBAR_BACKGROUND: string;
  NAVBAR_ACTIVE_BACKGROUND: string;
  NAVBAR_ACTIVE_TEXT: string;
  NAVBAR_INACTIVE_TEXT: string;
  INNER_SHADOw: string;
  CARD_SHADOW: string;
  DARK_BG: string;
  DARK_TEXT: string;
  BACKGROUND_LIGHT: string;
  PRICE_ERROR: string;
  LIST_BG: string;
  DARK_PURPLE: string;
  DARK_PURPLE_2: string;
  LIGHT_PURPLE: string;
  INCOME_PIE: string;
  EXPENSE_PIE: string;
  LIGHT_TEXT: string;
  ICON_COLOR: string;
  ICON_MUTED: string;
  HEADER_BACKGROUND: string;
  HEADER_GRADIENT: readonly [string, string, string, string];
}

const lightTheme: ThemeColors = {
  ...common,
  BACKGROUND: '#F0F2F5',
  TEXT: '#0F1114',
  SHADOW: 'rgba(30, 30, 36, 0.08)',
  SHADOW_OPACITY: 0.08,
  INPUT_BACKGROUND: '#FFFFFF',
  PLACEHOLDER_COLOR: 'rgba(26, 26, 30, 0.5)',
  BORDER_COLOR: '#DDE1E6',
  NAVBAR_BACKGROUND: '#FFFFFF',
  NAVBAR_ACTIVE_BACKGROUND: '#C6A56B',
  NAVBAR_ACTIVE_TEXT: '#1A1A1E',
  NAVBAR_INACTIVE_TEXT: '#9A9AA0',
  INNER_SHADOw: 'rgba(30, 30, 36, 0.04)',
  CARD_SHADOW: 'rgba(30, 30, 36, 0.06)',
  DARK_BG: COLORS.primary,
  DARK_TEXT: '#C6A56B',
  BACKGROUND_LIGHT: '#FFFFFF',
  LIST_BG: '#FFFFFF',
  LIGHT_TEXT: '#6B7280',
  ICON_COLOR: '#1E1E24',
  ICON_MUTED: '#6B7280',
  HEADER_BACKGROUND: '#3D3D45',
  HEADER_GRADIENT: ['#3D3D45', '#484850', '#53535B', '#5E5E66'] as const,
};

const darkTheme: ThemeColors = {
  ...common,
  BACKGROUND: '#1C1C20',
  TEXT: '#F7F7F8',
  SHADOW: 'rgba(0, 0, 0, 0.4)',
  SHADOW_OPACITY: 0.4,
  INPUT_BACKGROUND: '#2A2A30',
  PLACEHOLDER_COLOR: 'rgba(247, 247, 248, 0.5)',
  BORDER_COLOR: '#3A3A42',
  NAVBAR_BACKGROUND: '#2A2A30',
  NAVBAR_ACTIVE_BACKGROUND: '#C6A56B',
  NAVBAR_ACTIVE_TEXT: '#1A1A1E',
  NAVBAR_INACTIVE_TEXT: '#B8B8C0',
  INNER_SHADOw: 'rgba(198, 165, 107, 0.15)',
  CARD_SHADOW: 'rgba(0, 0, 0, 0.3)',
  DARK_BG: COLORS.accent,
  DARK_TEXT: '#1A1A1E',
  BACKGROUND_LIGHT: '#242428',
  LIST_BG: '#242428',
  LIGHT_TEXT: '#B8B8C0',
  ICON_COLOR: '#C6A56B',
  ICON_MUTED: '#B8B8C0',
  HEADER_BACKGROUND: '#0F1012',
  HEADER_GRADIENT: ['#0A0B0D', '#0F1012', '#16161A', '#1C1C20'] as const,
};

interface UseThemeReturn {
  theme: ThemeColors;
  setTheme: React.Dispatch<React.SetStateAction<ThemeOptions>>;
  isDark: boolean;
}

export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
        'Wrap a parent component in <ThemeProvider> to fix this error.',
    );
  }

  return {
    theme: context.theme === 'dark' ? darkTheme : lightTheme,
    setTheme: context.setTheme,
    isDark: context.theme === 'dark' ? true : false,
  };
};
