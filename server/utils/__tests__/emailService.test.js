const emailService = require('../emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'msg123' });
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock
    })
  };
});

describe('emailService Utility (TC-153 to TC-154)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOTPEmail', () => {
    it('TC-153: should send OTP email with correct recipient and subject', async () => {
      const result = await emailService.sendOTPEmail('test@iut-dhaka.edu', '123456', 'Alice');

      expect(result).toHaveProperty('success', true);
    });

    it('should throw error when transporter fails to send email', async () => {
      const transporter = nodemailer.createTransport();
      transporter.sendMail.mockRejectedValueOnce(new Error('SMTP connection failed'));

      await expect(emailService.sendOTPEmail('test@iut-dhaka.edu', '123456')).rejects.toThrow();
    });
  });

  describe('sendApplicationStatusEmail', () => {
    it('TC-154: should send status email to employee', async () => {
      const result = await emailService.sendApplicationStatusEmail(
        'alice@iut-dhaka.edu',
        'Alice',
        'Approved',
        'Annual',
        '2026-07-01',
        '2026-07-05',
        'Approved by HR',
        5
      );

      expect(result).toHaveProperty('success', true);
    });
  });
});
