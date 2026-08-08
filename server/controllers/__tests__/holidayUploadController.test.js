const holidayUploadController = require('../holidayUploadController');
const Vacation = require('../../models/Vacation');

jest.mock('../../models/Vacation');
jest.mock('multer', () => {
  class MulterError extends Error {}
  const multerMock = () => ({
    single: () => (req, res, cb) => cb(null)
  });
  multerMock.memoryStorage = jest.fn();
  multerMock.MulterError = MulterError;
  return multerMock;
});
jest.mock('pdf-parse', () => {
  return {
    PDFParse: jest.fn().mockImplementation(() => ({
      getText: jest.fn().mockResolvedValue({
        text: 'PUBLIC HOLIDAYS 2026\n26/03/2026 Independence Day\n16/12/2026 Victory Day\n' + 'x'.repeat(60)
      })
    }))
  };
});

describe('holidayUploadController (TC-116 to TC-123)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      headers: { 'content-type': 'multipart/form-data' },
      user: { id: 'hr123', roles: ['HR'] },
      file: {
        originalname: 'holidays.pdf',
        buffer: Buffer.from('fake pdf data')
      },
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadAndExtractHolidays', () => {
    it('TC-116: should reject non-HR user upload with 403', async () => {
      req.user = { id: 'emp123', roles: ['Employee'] };

      holidayUploadController.uploadAndExtractHolidays(req, res);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can upload holiday files' });
    });

    it('TC-117: should reject request without file attachment with 400', async () => {
      req.file = undefined;

      holidayUploadController.uploadAndExtractHolidays(req, res);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });

    it('TC-120: should process valid PDF and extract holidays', async () => {
      holidayUploadController.uploadAndExtractHolidays(req, res);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Successfully extracted')
        })
      );
    });
  });

  describe('saveExtractedHolidays', () => {
    it('TC-121: should reject non-HR bulk save attempt with 403', async () => {
      req.user = { id: 'emp123', roles: ['Employee'] };

      await holidayUploadController.saveExtractedHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can save holidays' });
    });

    it('TC-122: should reject empty array or invalid payload with 400', async () => {
      req.body = { holidays: [] };

      await holidayUploadController.saveExtractedHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No holidays to save' });
    });

    it('TC-123: should bulk save valid holidays while handling duplicate dates', async () => {
      req.body = {
        holidays: [
          { name: 'Independence Day', date: '2026-03-26', numberOfDays: 1 },
          { name: 'Duplicate Day', date: '2026-03-26', numberOfDays: 1 }
        ]
      };

      Vacation.findOne
        .mockResolvedValueOnce(null) // first holiday new
        .mockResolvedValueOnce({ name: 'Independence Day' }); // second holiday duplicate

      Vacation.prototype.save = jest.fn().mockResolvedValue(true);

      await holidayUploadController.saveExtractedHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          results: expect.objectContaining({
            saved: expect.arrayContaining([expect.anything()]),
            skipped: expect.arrayContaining([expect.anything()])
          })
        })
      );
    });
  });
});
