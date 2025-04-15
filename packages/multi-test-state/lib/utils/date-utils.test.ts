import { dateToCompact, compactToDate } from './date-utils';

describe('Date Utils', () => {
  test('integrity', () => {
    for (const year of [1000, 1980, 2020, 9999]) {
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 31; day++) {
          const yyyy = year.toString().padStart(4, '0');
          const mm = month.toString().padStart(2, '0');
          const dd = day.toString().padStart(2, '0');
          const yyyymmdd = `${yyyy}-${mm}-${dd}`;
          const compact = dateToCompact(yyyymmdd);
          const decoded = compactToDate(compact);
          expect(decoded).toEqual(yyyymmdd);
        }
      }
    }
  });
});
