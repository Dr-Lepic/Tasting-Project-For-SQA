const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../authController');
const User = require('../../models/User');
const Department = require('../../models/Department');
const OTP = require('../../models/OTP');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/User');
jest.mock('../../models/Department');
jest.mock('../../models/OTP');
jest.mock('../../utils/cloudinaryUpload', () => ({ uploadToCloudinary: jest.fn() }));
jest.mock('../../utils/emailService', () => ({
  sendOTPEmail: jest.fn(),
  generateOTP: jest.fn(() => '123456'),
}));

const res = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
const query = (value) => ({ populate: jest.fn().mockResolvedValue(value), select: jest.fn().mockReturnThis() });

describe('authController behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    Department.findById.mockResolvedValue({ _id: 'dep-1', name: 'CSE' });
    Department.findByIdAndUpdate.mockResolvedValue(true);
  });

  test('register succeeds with valid data', async () => {
    User.findOne.mockResolvedValue(null);
    User.mockImplementation(function (data) {
      Object.assign(this, data, { _id: 'user-1', save: jest.fn().mockResolvedValue(true), populate: jest.fn().mockResolvedValue(this) });
    });
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashed');
    jwt.sign.mockReturnValue('token');
    const response = res();
    await authController.register({ body: { name: 'A', email: 'a@iut-dhaka.edu', password: 'Pass123', designation: 'Lecturer', departmentId: 'dep-1' } }, response);
    expect(response.status).toHaveBeenCalledWith(201);
  });

  test('register rejects invalid email domain', async () => {
    const response = res();
    await authController.register({ body: { name: 'A', email: 'a@gmail.com', password: 'Pass123', designation: 'Lecturer', departmentId: 'dep-1' } }, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('login succeeds with valid credentials', async () => {
    const user = { _id: 'user-1', name: 'A', email: 'a@iut-dhaka.edu', designation: 'Lecturer', roles: ['Employee'], password: 'hashed', leaveQuota: {}, profilePic: null };
    User.findOne.mockReturnValue(query(user));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');
    const response = res();
    await authController.login({ body: { email: 'a@iut-dhaka.edu', password: 'Pass123' } }, response);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Login successful' }));
  });

  test('login rejects invalid password', async () => {
    const user = { password: 'hashed' };
    User.findOne.mockReturnValue(query(user));
    bcrypt.compare.mockResolvedValue(false);
    const response = res();
    await authController.login({ body: { email: 'a@iut-dhaka.edu', password: 'wrong' } }, response);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  test('forgotPassword sends OTP for existing account', async () => {
    User.findOne.mockResolvedValue({ name: 'A', email: 'a@iut-dhaka.edu' });
    const response = res();
    await authController.forgotPassword({ body: { email: 'a@iut-dhaka.edu' } }, response);
    expect(OTP.create).toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'OTP sent successfully to your email' }));
  });

  test('verifyOTP accepts valid code', async () => {
    OTP.findOne.mockResolvedValue({ email: 'a@iut-dhaka.edu', otp: '123456', attempts: 0 });
    const response = res();
    await authController.verifyOTP({ body: { email: 'a@iut-dhaka.edu', otp: '123456' } }, response);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'OTP verified successfully' }));
  });

  test('resetPassword updates password for existing user', async () => {
    const user = { password: 'old', save: jest.fn().mockResolvedValue(true) };
    User.findOne.mockResolvedValue(user);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('new-hash');
    const response = res();
    await authController.resetPassword({ body: { email: 'a@iut-dhaka.edu', newPassword: 'Pass123' } }, response);
    expect(user.password).toBe('new-hash');
    expect(response.json).toHaveBeenCalled();
  });
});