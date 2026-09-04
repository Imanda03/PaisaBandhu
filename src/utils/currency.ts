/** Nepalese Rupee (NPR) — use Rs., not the Indian ₹ symbol */
export const CURRENCY_LOCALE = 'en-NP';
export const CURRENCY_SYMBOL = 'Rs.';

type AmountFormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatAmountNumber(
  amount: number,
  options?: AmountFormatOptions,
): string {
  return Math.abs(amount).toLocaleString(CURRENCY_LOCALE, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });
}

/** "Rs. 1,234" */
export function formatCurrency(
  amount: number,
  options?: AmountFormatOptions & { absolute?: boolean },
): string {
  const value = options?.absolute ? Math.abs(amount) : amount;
  return `${CURRENCY_SYMBOL} ${formatAmountNumber(value, options)}`;
}

/** "+Rs. 100" or "−Rs. 100" */
export function formatSignedCurrency(
  amount: number,
  options?: AmountFormatOptions,
): string {
  if (amount === 0) return formatCurrency(0, options);
  const sign = amount > 0 ? '+' : '−';
  return `${sign}${formatCurrency(Math.abs(amount), options)}`;
}
