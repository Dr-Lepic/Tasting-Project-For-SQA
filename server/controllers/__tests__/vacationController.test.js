const vacationController = require('../vacationController');
const Vacation = require('../../models/Vacation');

jest.mock('../../models/Vacation');

describe('vacationController (TC-94 to TC-110)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {},
      user: { id: 'hrUser123', roles: ['HR'] }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllHolidays', () => {
    it('TC-94: should return all holidays sorted by date', async () => {
      const mockHolidays = [{ name: 'Independence Day', date: new Date('2026-03-26') }];
      Vacation.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockHolidays)
      });

      await vacationController.getAllHolidays(req, res);

      expect(res.json).toHaveBeenCalledWith({ holidays: mockHolidays });
    });

    it('should handle server error when fetching all holidays', async () => {
      Vacation.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      await vacationController.getAllHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getHolidaysInRange', () => {
    it('TC-95: should get holidays in valid date range', async () => {
      req.query = { startDate: '2026-03-01', endDate: '2026-03-31' };
      const holiday = {
        name: 'Independence Day',
        date: new Date('2026-03-26'),
        numberOfDays: 1
      };
      Vacation.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([holiday])
      });

      await vacationController.getHolidaysInRange(req, res);

      expect(res.json).toHaveBeenCalledWith({ holidays: [holiday] });
    });

    it('TC-96: should reject request missing startDate or endDate with 400', async () => {
      req.query = { startDate: '2026-03-01' };

      await vacationController.getHolidaysInRange(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Start date and end date are required' });
    });

    it('TC-97: should reject request where endDate is before startDate with 400', async () => {
      req.query = { startDate: '2026-03-31', endDate: '2026-03-01' };

      await vacationController.getHolidaysInRange(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'End date cannot be before start date' });
    });
  });

  describe('createHoliday', () => {
    it('TC-98: should allow HR user to create holiday with valid data', async () => {
      req.body = { name: 'Victory Day', date: '2026-12-16', numberOfDays: 1 };
      Vacation.findOne.mockResolvedValue(null);
      Vacation.prototype.save = jest.fn().mockResolvedValue(true);

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Holiday created successfully' })
      );
    });

    it('TC-99: should reject non-HR user attempt to create holiday with 403', async () => {
      req.user = { id: 'emp123', roles: ['Employee'] };
      req.body = { name: 'New Year', date: '2026-01-01' };

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can create holidays' });
    });

    it('TC-100: should reject creation missing name or date with 400', async () => {
      req.body = { name: 'New Year' };

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Holiday name and date are required' });
    });

    it('TC-101: should reject invalid date string with 400', async () => {
      req.body = { name: 'Invalid Day', date: 'not-a-valid-date' };

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    });

    it('TC-102: should reject numberOfDays outside 1-30 range with 400', async () => {
      req.body = { name: 'Long Vacation', date: '2026-06-01', numberOfDays: 35 };

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Number of days must be between 1 and 30' });
    });

    it('TC-103: should reject duplicate holiday on same date with 400', async () => {
      req.body = { name: 'May Day', date: '2026-05-01', numberOfDays: 1 };
      Vacation.findOne.mockResolvedValue({ _id: 'existingHolid' });

      await vacationController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'A holiday already exists on this date' });
    });
  });

  describe('updateHoliday', () => {
    it('TC-104: should allow HR user to update existing holiday successfully', async () => {
      req.params = { holidayId: 'hol123' };
      req.body = { name: 'Updated Holiday', numberOfDays: 2 };
      const mockHoliday = {
        _id: 'hol123',
        name: 'Old Name',
        numberOfDays: 1,
        save: jest.fn().mockResolvedValue(true)
      };
      Vacation.findById.mockResolvedValue(mockHoliday);

      await vacationController.updateHoliday(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Holiday updated successfully' })
      );
    });

    it('TC-105: should reject non-HR user attempt to update holiday with 403', async () => {
      req.user = { id: 'emp123', roles: ['Employee'] };
      req.params = { holidayId: 'hol123' };

      await vacationController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can update holidays' });
    });

    it('TC-106: should return 404 for non-existent holiday ID', async () => {
      req.params = { holidayId: 'nonexistent' };
      Vacation.findById.mockResolvedValue(null);

      await vacationController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Holiday not found' });
    });

    it('TC-107: should reject update with invalid date format', async () => {
      req.params = { holidayId: 'hol123' };
      req.body = { date: 'invalid-date' };
      Vacation.findById.mockResolvedValue({ _id: 'hol123' });

      await vacationController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    });

    it('TC-108: should reject updating holiday date to an already occupied date', async () => {
      req.params = { holidayId: 'hol123' };
      req.body = { date: '2026-05-01' };
      Vacation.findById.mockResolvedValue({ _id: 'hol123' });
      Vacation.findOne.mockResolvedValue({ _id: 'otherHol' });

      await vacationController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'A holiday already exists on this date' });
    });
  });

  describe('deleteHoliday', () => {
    it('TC-109: should allow HR user to delete existing holiday', async () => {
      req.params = { holidayId: 'hol123' };
      Vacation.findByIdAndDelete.mockResolvedValue({ _id: 'hol123' });

      await vacationController.deleteHoliday(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Holiday deleted successfully' });
    });

    it('TC-110: should reject non-HR user attempt to delete holiday with 403', async () => {
      req.user = { id: 'emp123', roles: ['Employee'] };
      req.params = { holidayId: 'hol123' };

      await vacationController.deleteHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can delete holidays' });
    });
  });
});
