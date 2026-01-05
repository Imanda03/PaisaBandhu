export const API_URL = 'https://3755dcb83b18.ngrok-free.app/api';

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

export const ICONS = [
  { id: 1, name: '🏠', value: 'rent' },
  { id: 2, name: '🍎', value: 'groceries' },
  { id: 3, name: '🚗', value: 'transport' },
  { id: 4, name: '💡', value: 'utilities' },
  { id: 5, name: '👕', value: 'clothing' },

  { id: 7, name: '🍔', value: 'food' },
  { id: 9, name: '💊', value: 'medical' },

  { id: 11, name: '💰', value: 'income' },

  { id: 14, name: '🎮', value: 'entertainment' },
  { id: 15, name: '✈️', value: 'travel' },
  { id: 16, name: '🎁', value: 'gifts' },

  { id: 17, name: '🛠️', value: 'repairs' },
  { id: 18, name: '🐶', value: 'pets' },
  { id: 19, name: '🎓', value: 'education' },
];

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
