const { extractHolidaysFromText, extractFromTableFormat, parseDate } = require('../holidayExtractor');

describe('holidayExtractor Utility (TC-124 to TC-125)', () => {
  describe('parseDate', () => {
    it('TC-124: should correctly parse various date string formats', () => {
      // YYYY-MM-DD
      expect(parseDate('2026-03-26')).toBe('2026-03-26');
      // DD-MM-YYYY
      expect(parseDate('26-03-2026')).toBe('2026-03-26');
      // Month DD, YYYY
      expect(parseDate('March 26, 2026')).toBe('2026-03-26');
      // Short month format
      expect(parseDate('26 Mar 2026')).toBe('2026-03-26');
      // Invalid format
      expect(parseDate('Not A Date')).toBeNull();
    });
  });

  describe('extractHolidaysFromText', () => {
    it('TC-125: should extract holiday names and dates from document text', () => {
      const sampleText = `
        PUBLIC HOLIDAYS 2026
        26/03/2026 Independence Day
        16/12/2026 Victory Day
      `;

      const holidays = extractHolidaysFromText(sampleText);

      expect(Array.isArray(holidays)).toBe(true);
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays[0]).toHaveProperty('name');
      expect(holidays[0]).toHaveProperty('date');
    });

    it('should return empty array if no dates match pattern', () => {
      const sampleText = 'This is random text with no dates or holidays.';
      const holidays = extractHolidaysFromText(sampleText);
      expect(holidays).toEqual([]);
    });

    it('should support extractFromTableFormat fallback', () => {
      const tableText = `
        Date | Holiday Name
        2026-05-01 | May Day
      `;
      const holidays = extractFromTableFormat(tableText);
      expect(Array.isArray(holidays)).toBe(true);
    });
  });
});
