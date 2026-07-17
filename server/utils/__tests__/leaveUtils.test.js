const Vacation = require('../../models/Vacation');
const { isHoliday, calculateWeekdays, calculateOverlapDays } = require('../leaveUtils');

jest.mock('../../models/Vacation', () => ({
  find: jest.fn(),
}));

describe('leaveUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('isHoliday returns true when the date falls inside a holiday range', () => {
    const holidays = [{ date: '2026-07-14', numberOfDays: 2 }];

    expect(isHoliday('2026-07-15', holidays)).toBe(true);
    expect(isHoliday('2026-07-16', holidays)).toBe(false);
  });

  test('calculateWeekdays counts only weekdays when no holidays exist', async () => {
    Vacation.find.mockResolvedValueOnce([]);

    await expect(calculateWeekdays('2026-07-13', '2026-07-17')).resolves.toBe(5);
    expect(Vacation.find).toHaveBeenCalledWith({ date: { $lte: expect.any(Date) } });
  });

  test('calculateWeekdays excludes holiday days from the weekday count', async () => {
    Vacation.find.mockResolvedValueOnce([
      { date: '2026-07-14', numberOfDays: 2 },
    ]);

    await expect(calculateWeekdays('2026-07-13', '2026-07-17')).resolves.toBe(3);
  });

  test('calculateOverlapDays returns 0 when leave range does not intersect with the period', async () => {
    await expect(
      calculateOverlapDays('2026-07-01', '2026-07-02', '2026-07-10', '2026-07-11')
    ).resolves.toBe(0);
  });
});