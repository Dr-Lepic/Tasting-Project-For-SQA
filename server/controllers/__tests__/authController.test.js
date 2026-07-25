const authController = require('../authController');
const User = require('../../models/User');
const Department = require('../../models/Department');
const OTP = require('../../models/OTP');
const { sendOTPEmail, generateOTP } = require('../../utils/emailService');

jest.mock('../../models/User');
jest.mock('../../models/Department');
jest.mock('../../models/OTP');
jest.mock('../../utils/cloudinaryUpload', () => ({
  uploadToCloudinary: jest.fn(),
}));
jest.mock('../../utils/emailService', () => ({
  sendOTPEmail: jest.fn(),
  generateOTP: jest.fn(() => '123456'),
}));

describe('authController forgot password case-sensitivity regression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('should find the registered account when forgot-password email is typed in lowercase', async () => {
    const req = { body: { email: 'test@iut-dhaka.edu' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockImplementation(async ({ email }) => {
      if (email === 'Test@iut-dhaka.edu') {
        return {
          _id: 'user-1',
          name: 'Test User',
          email: 'Test@iut-dhaka.edu',
        };
      }

      return null;
    });

    await authController.forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@iut-dhaka.edu' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'OTP sent successfully to your email' })
    );
  });

  test('TC-91: verifyOTP should reject numeric OTP input with 400 Bad Request instead of throwing 500 error', async () => {
    const req = { body: { email: 'test@iut-dhaka.edu', otp: 123456 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    OTP.findOne.mockResolvedValue({ email: 'test@iut-dhaka.edu', otp: '123456', attempts: 0 });

    await authController.verifyOTP(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});