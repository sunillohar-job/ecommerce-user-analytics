export type RateColor = 'error.main' | 'warning.main' | 'info.main' | 'success.main';

export const getConversionTextColor = (rate: number | string): RateColor => {
  rate = parseFloat(rate as string);
  if (rate === 0) return 'error.main';
  if (rate < 2) return 'warning.main';
  if (rate < 5) return 'info.main';
  return 'success.main';
};
