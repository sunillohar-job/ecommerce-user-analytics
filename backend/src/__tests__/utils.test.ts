import { isValidDate, getDateRange } from '../utils';
import { AppError } from '../middlewares/error-handler.middleware';

describe('Utils', () => {
  describe('isValidDate', () => {
    it('should return true for valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2023-01-01'))).toBe(true);
      expect(isValidDate(new Date(2023, 0, 1))).toBe(true);
    });

    it('should return false for invalid Date objects', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(new Date(NaN))).toBe(false);
    });
  });

  describe('getDateRange', () => {
    beforeEach(() => {
      // Mock current date to ensure consistent tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-06-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return correct date range for "today"', () => {
      const { start, end } = getDateRange('today');
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });

    it('should return correct date range for "yesterday"', () => {
      const { start, end } = getDateRange('yesterday');
      const yesterday = new Date('2023-06-14T00:00:00Z');
      expect(start.getDate()).toBe(yesterday.getDate());
      expect(start.getHours()).toBe(0);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
    });

    it('should return correct date range for "last_7_days"', () => {
      const { start, end } = getDateRange('last_7_days');
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
    });

    it('should return correct date range for "this_week"', () => {
      const { start, end } = getDateRange('this_week');
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
    });

    it('should return correct date range for "last_week"', () => {
      const { start, end } = getDateRange('last_week');
      expect(start.getHours()).toBe(0);
      expect(end.getHours()).toBe(23);
    });

    it('should return correct date range for "this_month"', () => {
      const { start, end } = getDateRange('this_month');
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
    });

    it('should return correct date range for "last_month"', () => {
      const { start, end } = getDateRange('last_month');
      expect(start.getHours()).toBe(0);
      expect(end.getHours()).toBe(23);
    });

    it('should return correct date range for "this_year"', () => {
      const { start, end } = getDateRange('this_year');
      expect(start.getMonth()).toBe(0); // January
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
    });

    it('should return correct date range for "last_year"', () => {
      const { start, end } = getDateRange('last_year');
      expect(start.getMonth()).toBe(0); // January
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
      expect(end.getHours()).toBe(23);
    });

    it('should throw AppError for invalid range', () => {
      expect(() => getDateRange('invalid_range')).toThrow(AppError);
      expect(() => getDateRange('invalid_range')).toThrow('Invalid "period" range');
    });

    it('should throw AppError for empty string', () => {
      expect(() => getDateRange('')).toThrow(AppError);
    });
  });
});

