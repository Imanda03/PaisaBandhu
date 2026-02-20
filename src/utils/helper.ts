// API base URL - update with your backend. Ngrok URLs change on restart; use a stable URL for production.
export const API_URL = 'https://aristolochiaceous-unhelping-johana.ngrok-free.app/api';

export const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}`;
  if (hour < 18) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
};

export const getFormattedDate = () => {
  const now = new Date();
  const options: any = {
    weekday: 'long',
    // year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return now.toLocaleDateString('en-US', options);
};

export type IconItem = { id: number; name: string; value: string; subLabel: string };

/** Category icons grouped by subLabel. Use ICONS for flat list, getIconsByGroup() for sections. */
export const ICONS: IconItem[] = [
  // Housing
  { id: 1, name: '🏠', value: 'rent', subLabel: 'Housing' },
  // { id: 2, name: '🔑', value: 'mortgage', subLabel: 'Housing' },
  { id: 3, name: '💡', value: 'utilities', subLabel: 'Housing' },
  { id: 4, name: '📺', value: 'internet', subLabel: 'Housing' },
  { id: 5, name: '🏡', value: 'home', subLabel: 'Housing' },
  // Food & Groceries
  { id: 10, name: '🍎', value: 'groceries', subLabel: 'Food & Groceries' },
  { id: 11, name: '🍔', value: 'food', subLabel: 'Food & Groceries' },
  { id: 12, name: '☕', value: 'coffee', subLabel: 'Food & Groceries' },
  // { id: 13, name: '🍕', value: 'dining', subLabel: 'Food & Groceries' },
  { id: 14, name: '🛒', value: 'shopping', subLabel: 'Food & Groceries' },
  // Transport
  { id: 20, name: '🚗', value: 'transport', subLabel: 'Transport' },
  { id: 21, name: '⛽', value: 'fuel', subLabel: 'Transport' },
  // { id: 22, name: '🚌', value: 'transit', subLabel: 'Transport' },
  { id: 23, name: '✈️', value: 'travel', subLabel: 'Transport' },
  { id: 24, name: '🅿️', value: 'parking', subLabel: 'Transport' },
  // Shopping & Personal
  { id: 30, name: '👕', value: 'clothing', subLabel: 'Shopping & Personal' },
  { id: 31, name: '💄', value: 'personal', subLabel: 'Shopping & Personal' },
  { id: 32, name: '🎁', value: 'gifts', subLabel: 'Shopping & Personal' },
  { id: 33, name: '🛍️', value: 'retail', subLabel: 'Shopping & Personal' },
  // Health
  { id: 40, name: '💊', value: 'medical', subLabel: 'Health' },
  { id: 41, name: '🏥', value: 'healthcare', subLabel: 'Health' },
  { id: 42, name: '💪', value: 'fitness', subLabel: 'Health' },
  // { id: 43, name: '🧘', value: 'wellness', subLabel: 'Health' },
  // Income
  { id: 50, name: '💰', value: 'income', subLabel: 'Income' },
  { id: 51, name: '💵', value: 'salary', subLabel: 'Income' },
  { id: 52, name: '📈', value: 'investment', subLabel: 'Income' },
  // { id: 53, name: '🎯', value: 'bonus', subLabel: 'Income' },
  // Lifestyle & Entertainment
  { id: 60, name: '🎮', value: 'entertainment', subLabel: 'Lifestyle & Entertainment' },
  { id: 61, name: '🎬', value: 'movies', subLabel: 'Lifestyle & Entertainment' },
  { id: 62, name: '📚', value: 'books', subLabel: 'Lifestyle & Entertainment' },
  { id: 63, name: '🎵', value: 'music', subLabel: 'Lifestyle & Entertainment' },
  // { id: 64, name: '🎳', value: 'hobbies', subLabel: 'Lifestyle & Entertainment' },
  // Education & Kids
  { id: 70, name: '🎓', value: 'education', subLabel: 'Education & Kids' },
  { id: 71, name: '👶', value: 'kids', subLabel: 'Education & Kids' },
  { id: 72, name: '📖', value: 'courses', subLabel: 'Education & Kids' },
  // Home & Pets
  { id: 80, name: '🛠️', value: 'repairs', subLabel: 'Home & Pets' },
  { id: 81, name: '🐶', value: 'pets', subLabel: 'Home & Pets' },
  // { id: 82, name: '🌿', value: 'garden', subLabel: 'Home & Pets' },
  { id: 83, name: '🧹', value: 'cleaning', subLabel: 'Home & Pets' },
  // Other
  { id: 90, name: '📦', value: 'subscriptions', subLabel: 'Other' },
  { id: 91, name: '💳', value: 'bank_fees', subLabel: 'Other' },
  { id: 92, name: '🙏', value: 'donations', subLabel: 'Other' },
  { id: 93, name: '❓', value: 'other', subLabel: 'Other' },
];

/** Group icons by subLabel for sectioned display. Order matches ICONS. */
export function getIconsByGroup(): { subLabel: string; icons: IconItem[] }[] {
  const map = new Map<string, IconItem[]>();
  ICONS.forEach((icon) => {
    const list = map.get(icon.subLabel) || [];
    list.push(icon);
    map.set(icon.subLabel, list);
  });
  const order = Array.from(new Set(ICONS.map((i) => i.subLabel)));
  return order.map((subLabel) => ({ subLabel, icons: map.get(subLabel) || [] }));
}

export const formatTimeAgo = (rawDate: string): string => {
  const date = new Date(rawDate);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'Just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minute(s) ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hour(s) ago`;
  if (secondsAgo < 7 * 86400)
    return `${Math.floor(secondsAgo / 86400)} day(s) ago`;

  return formatReadableDate(rawDate);
};

export const formatReadableDate = (
  rawDate: string,
  locale: string = 'en-US',
): string => {
  const date = new Date(rawDate);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString(locale, options);
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text?.charAt(0)?.toUpperCase() + text.slice(1);
};

export const getPositiveNumber = (value: number | string): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Math.abs(num);
};
