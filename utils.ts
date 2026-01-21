
import { AgeDetails } from './types';

// Constants for Zodiac
const ZODIAC_ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

export const getLunarYear = (date: Date): number => {
  // Uses Intl.DateTimeFormat to get the Chinese Lunar Year
  const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { year: 'numeric' });
  const parts = formatter.formatToParts(date);
  // Fix: Cast p.type to string to allow comparison with 'relatedYear' which is present in Chinese calendars but may not be in standard TypeScript type definitions.
  const yearPart = parts.find(p => (p.type as string) === 'relatedYear' || p.type === 'year');
  // fallback if year part is not available
  return yearPart ? parseInt(yearPart.value) : date.getFullYear();
};

export const getLunarDateString = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    dateStyle: 'full'
  }).format(date);
};

export const calculateAge = (birthDate: Date): AgeDetails => {
  const now = new Date();
  
  // 1. 周岁 (Zhousui) - Real Age
  let zhousui = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    zhousui--;
  }

  // 2. 虚岁 (Xusui) - Nominal Age
  // Formula: 1 + (CurrentLunarYear - BirthLunarYear)
  const currentLunarYear = getLunarYear(now);
  const birthLunarYear = getLunarYear(birthDate);
  const xusui = 1 + (currentLunarYear - birthLunarYear);

  // 3. Days Lived
  const diffTime = Math.abs(now.getTime() - birthDate.getTime());
  const daysLived = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 4. Zodiac
  // Traditional zodiac is based on the Lunar Year's Stem-Branch, but simplified for UI
  const zodiac = ZODIAC_ANIMALS[(birthLunarYear - 4) % 12];

  // 5. Next Birthday
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    zhousui,
    xusui,
    daysLived,
    zodiac,
    nextBirthdayDays,
    lunarBirthDate: getLunarDateString(birthDate),
    lunarCurrentDate: getLunarDateString(now)
  };
};

export const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};
