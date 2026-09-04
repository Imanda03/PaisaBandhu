import { useTheme } from '../../utils/colors';

export function useLendingChrome() {
  const { theme, isDark } = useTheme();
  return {
    theme,
    isDark,
    rim: isDark ? 'rgba(198, 165, 107, 0.22)' : 'rgba(198, 165, 107, 0.35)',
    hairline: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    innerBg: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.5)',
    monoFill: isDark ? '#1C1C20' : '#FFFFFF',
    rimMetallic: (isDark
      ? ['#4A4438', '#2E2E32', '#C6A56B', '#2E2E32', '#4A4438']
      : ['#D8CAB0', '#FFFFFF', '#C6A56B', '#FFFFFF', '#D8CAB0']) as [
      string,
      string,
      string,
      string,
      string,
    ],
    faceColors: (isDark
      ? ['#1E1E22', '#25252C', '#1A1A1E']
      : ['#FFFFFF', '#FAFAFB', '#F3F4F6']) as [string, string, string],
    vaultFace: (isDark
      ? ['#16161A', '#1E1E24', '#141418']
      : ['#FFFCF7', '#FFFFFF', '#F6F2EA']) as [string, string, string],
    goldCTA: ['#F2E6D2', '#E8CF9E', '#C6A56B', '#A8894F'] as const,
    topAccent: isDark
      ? ['rgba(198, 165, 107, 0.45)', 'rgba(198, 165, 107, 0.08)']
      : ['rgba(198, 165, 107, 0.55)', 'rgba(198, 165, 107, 0.12)'],
    lentAccent: isDark
      ? (['#1b4332', '#52b788'] as const)
      : (['#40916c', '#95d5b2'] as const),
    borrowedAccent: isDark
      ? (['#6a040f', '#e01e37'] as const)
      : (['#e11d48', '#fda4af'] as const),
    lentGlow: isDark ? 'rgba(82, 183, 136, 0.18)' : 'rgba(64, 145, 108, 0.14)',
    borrowedGlow: isDark ? 'rgba(224, 30, 55, 0.18)' : 'rgba(225, 29, 72, 0.12)',
  };
}

export function lendingRemaining(item: {
  amount: number;
  payments: { amount: number }[];
}) {
  const paid = item.payments.reduce((s, p) => s + p.amount, 0);
  return Math.max(item.amount - paid, 0);
}

export function lendingProgress(item: {
  amount: number;
  payments: { amount: number }[];
}) {
  if (item.amount <= 0) return 0;
  const paid = item.payments.reduce((s, p) => s + p.amount, 0);
  return Math.min(paid / item.amount, 1);
}
