import { AppError } from './middlewares/error-handler.middleware';

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function getDateRange(range: string): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;

    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;

    case 'last_7_days':
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;

    case 'this_week':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      break;

    case 'last_week':
      start.setDate(start.getDate() - start.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - end.getDay() - 1);
      end.setHours(23, 59, 59, 999);
      break;

    case 'this_month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;

    case 'last_month':
      start.setMonth(start.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'this_year':
      start.setMonth(0, 1); // Jan 1
      start.setHours(0, 0, 0, 0);
      break;

    case 'last_year':
      start.setFullYear(start.getFullYear() - 1, 0, 1); // Jan 1 last year
      start.setHours(0, 0, 0, 0);

      end.setFullYear(end.getFullYear() - 1, 11, 31); // Dec 31 last year
      end.setHours(23, 59, 59, 999);
      break;

    default:
      throw new AppError({
        message: 'Invalid "period" range',
        status: 400,
      });
  }

  return { start, end };
}
