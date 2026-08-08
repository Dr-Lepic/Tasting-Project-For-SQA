const authController = require('../authController');
const leaveQuotaController = require('../leaveQuotaController');
const leaveController = require('../leaveController');
const User = require('../../models/User');
const OTP = require('../../models/OTP');
const Vacation = require('../../models/Vacation');
const { sendOTPEmail } = require('../../utils/emailService');

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../models/User');
jest.mock('../../models/OTP');
jest.mock('../../models/Vacation');
jest.mock('../../utils/cloudinaryUpload', () => ({ uploadToCloudinary: jest.fn() }));
jest.mock('../../utils/emailService', () => ({
  sendOTPEmail: jest.fn(),
  generateOTP: jest.fn(() => '123456'),
}));

const makeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

describe('bug regression tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.updateMany.mockResolvedValue({ modifiedCount: 1 });
  });

  test('forgotPassword should find a mixed-case registered email', async () => {
    User.findOne.mockImplementation(({ email }) => {
      if (email && email.toLowerCase() === 'test@iut-dhaka.edu') {
        return Promise.resolve({ name: 'Test', email: 'test@iut-dhaka.edu' });
      }
      return Promise.resolve(null);
    });
    OTP.deleteMany.mockResolvedValue({ deletedCount: 0 });
    OTP.create.mockResolvedValue(true);
    sendOTPEmail.mockResolvedValue({ success: true, messageId: 'msg1' });

    const res = makeRes();
    await authController.forgotPassword({ body: { email: 'test@iut-dhaka.edu' } }, res);

    expect(OTP.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'OTP sent successfully to your email' }));
  });

  test('resetPassword should update a mixed-case registered email', async () => {
    const user = { password: 'old', save: jest.fn().mockResolvedValue(true) };
    User.findOne.mockImplementation(({ email }) => {
      if (email && email.toLowerCase() === 'test@iut-dhaka.edu') {
        return Promise.resolve(user);
      }
      return Promise.resolve(null);
    });

    const res = makeRes();
    await authController.resetPassword({ body: { email: 'test@iut-dhaka.edu', newPassword: 'Pass123' } }, res);

    expect(user.password).not.toBe('old');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Password reset successfully. You can now login with your new password.' }));
  });

  test('applyLeave should reject a one-day mismatch after excluding weekends', async () => {
    const user = {
      _id: 'user-1',
      name: 'Test User',
      email: 'test@iut-dhaka.edu',
      designation: 'Lecturer',
      roles: ['Employee'],
      department: { _id: 'dep-1', name: 'CSE' },
      leaveQuota: { annual: { allocated: 20, used: 0 }, casual: { allocated: 10, used: 0 } },
      hasRole: jest.fn(() => false),
    };

    User.findById.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(user) });
    Vacation.find.mockResolvedValue([]);

    const res = makeRes();
    await leaveController.applyLeave({
      user: { id: 'user-1' },
      body: {
        startDate: '2026-07-03',
        endDate: '2026-07-05',
        type: 'Annual',
        reason: 'Personal',
        numberOfDays: 3,
      },
    }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
