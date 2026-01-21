
export interface AgeDetails {
  zhousui: number;
  xusui: number;
  daysLived: number;
  zodiac: string;
  solarTerm?: string;
  nextBirthdayDays: number;
  lunarBirthDate: string;
  lunarCurrentDate: string;
}

export interface InsightResponse {
  culturalSignificance: string;
  zodiacReading: string;
  lifeStageAdvice: string;
}
