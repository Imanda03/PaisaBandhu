import { useContext } from 'react';
import { ThemeContext, ThemeOptions } from '../context/ThemeProvider';

// New Color Palette
export const COLORS = {
  primary: '#1B3C53', // Dark blue - main dark color
  secondary: '#E3E3E3', // Light gray - light backgrounds
  accent: '#234C6A', // Medium-dark blue - primary accent
  light: '#456882', // Medium blue - secondary elements
} as const;

const common = {
  WARNING: '#FFB74D',
  ERROR: '#E57373',
  SUCCESS: '#81C784',
  PURPLE: '#234C6A', // Medium-dark blue as primary
  PRIMARY: '#1B3C53', // Dark blue
  SECONDARY: '#E3E3E3', // Light gray
  PRICE_ERROR: '#E57373',
  WARNING_LIGHT: '#FFF3E0',
  ERROR_LIGHT: '#FFEBEE',
  SUCCESS_LIGHT: '#E8F5E9',
  DARK_PURPLE: '#1B3C53', // Dark blue
  DARK_PURPLE_2: '#234C6A', // Medium-dark blue
  LIGHT_PURPLE: '#456882', // Medium blue
  INCOME_PIE: '#81C784', // Success green
  EXPENSE_PIE: '#E57373', // Error red
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
}

const lightTheme: ThemeColors = {
  ...common,
  BACKGROUND: '#E3E3E3', // Light gray background
  TEXT: '#1B3C53', // Dark blue text
  SHADOW: 'rgba(27, 60, 83, 0.15)', // Dark blue shadow
  SHADOW_OPACITY: 0.15,
  INPUT_BACKGROUND: '#FFFFFF', // White inputs
  PLACEHOLDER_COLOR: 'rgba(27, 60, 83, 0.5)',
  BORDER_COLOR: '#456882', // Medium blue borders
  NAVBAR_BACKGROUND: '#1B3C53', // Dark blue navbar
  NAVBAR_ACTIVE_BACKGROUND: '#234C6A', // Medium-dark blue active
  NAVBAR_ACTIVE_TEXT: '#E3E3E3', // Light gray text on active
  NAVBAR_INACTIVE_TEXT: '#456882', // Medium blue inactive
  INNER_SHADOw: 'rgba(27, 60, 83, 0.1)',
  CARD_SHADOW: 'rgba(35, 76, 106, 0.2)',
  DARK_BG: COLORS.primary, // #1B3C53
  DARK_TEXT: COLORS.secondary, // #E3E3E3
  BACKGROUND_LIGHT: '#FFFFFF', // White cards
  LIST_BG: '#FFFFFF', // White list background
  LIGHT_TEXT: '#456882', // Medium blue for secondary text
};

const darkTheme: ThemeColors = {
  ...common,
  BACKGROUND: '#152532', // Darker version of #1B3C53
  TEXT: '#E3E3E3', // Light gray text
  SHADOW: 'rgba(0, 0, 0, 0.3)',
  SHADOW_OPACITY: 0.25,
  INPUT_BACKGROUND: '#1B3C53', // Dark blue inputs
  PLACEHOLDER_COLOR: 'rgba(227, 227, 227, 0.5)',
  BORDER_COLOR: '#456882', // Medium blue borders
  NAVBAR_BACKGROUND: '#1B3C53', // Dark blue navbar
  NAVBAR_ACTIVE_BACKGROUND: '#234C6A', // Medium-dark blue active
  NAVBAR_ACTIVE_TEXT: '#E3E3E3', // Light gray text on active
  NAVBAR_INACTIVE_TEXT: '#456882', // Medium blue inactive
  INNER_SHADOw: 'rgba(35, 76, 106, 0.2)',
  CARD_SHADOW: 'rgba(0, 0, 0, 0.3)',
  DARK_BG: COLORS.secondary, // #E3E3E3
  DARK_TEXT: COLORS.primary, // #1B3C53
  BACKGROUND_LIGHT: '#1B3C53', // Dark blue cards
  LIST_BG: '#1B3C53', // Dark blue list
  LIGHT_TEXT: '#456882', // Medium blue for secondary text
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
