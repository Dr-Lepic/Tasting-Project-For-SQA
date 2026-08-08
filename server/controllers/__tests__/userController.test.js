const userController = require('../userController');
const User = require('../../models/User');
const LeaveRequest = require('../../models/LeaveRequest');
const bcrypt = require('bcryptjs');

jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');
jest.mock('bcryptjs');
jest.mock('../../utils/cloudinaryUpload');

describe('userController (TC-132 to TC-137, TC-151 to TC-154)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'u123', roles: ['Employee'] },
      params: {},
      body: {},
      query: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserLeaveStatistics', () => {
    it('TC-132: should get leave statistics for valid current user', async () => {
      const mockUser = {
        leaveQuota: {
          annual: { allocated: 20, used: 5 },
          casual: { allocated: 10, used: 2 }
        }
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUser)
        })
      });

      await userController.getUserLeaveStatistics(req, res);

      expect(res.json).toHaveBeenCalledWith({
        leaveData: {
          annual: { total: 20, taken: 5, remaining: 15 },
          casual: { total: 10, taken: 2, remaining: 8 }
        }
      });
    });

    it('should return 404 if user not found for leave statistics', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      });

      await userController.getUserLeaveStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('getDepartmentMembers', () => {
    it('TC-133: should fetch department members with leave status', async () => {
      User.findById.mockResolvedValue({ _id: 'u123', department: 'd1' });
      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([
              { _id: 'm1', name: 'Alice' },
              { _id: 'm2', name: 'Bob' }
            ])
          })
        })
      });
      LeaveRequest.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      });

      await userController.getDepartmentMembers(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          members: expect.arrayContaining([
            expect.objectContaining({ name: 'Alice', currentStatus: 'OnDuty' })
          ])
        })
      );
    });
  });

  describe('getMembersByDepartmentId', () => {
    it('TC-134: should allow HR to view members by department ID', async () => {
      req.user = { id: 'hr1', roles: ['HR'] };
      req.params = { departmentId: 'd1' };

      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([{ _id: 'm1', name: 'Charlie' }])
            })
          })
        })
      });
      LeaveRequest.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null)
        })
      });

      await userController.getMembersByDepartmentId(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          members: expect.arrayContaining([
            expect.objectContaining({ name: 'Charlie' })
          ])
        })
      );
    });

    it('TC-135: should reject non-HR view department members request with 403 (Fails due to Bug SQA-14)', async () => {
      req.user = { id: 'emp1', roles: ['Employee'] };
      req.params = { departmentId: 'd1' };

      await userController.getMembersByDepartmentId(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can view department members' });
    });
  });

  describe('updateProfile', () => {
    it('TC-136: should update user profile successfully', async () => {
      req.body = { phone: '1234567890', designation: 'Senior Lecturer' };
      const updatedUser = {
        _id: 'u123',
        name: 'Test User',
        email: 'test@iut-dhaka.edu',
        designation: 'Senior Lecturer',
        roles: ['Employee'],
        department: 'CSE'
      };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(updatedUser)
        })
      });

      await userController.updateProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Profile updated successfully'
        })
      );
    });
  });

  describe('changePassword', () => {
    it('TC-137: should change user password with valid current password', async () => {
      req.body = { currentPassword: 'oldPassword123', newPassword: 'newPassword123' };
      const mockUser = {
        _id: 'u123',
        password: 'hashedOldPassword',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedNewPassword');

      await userController.changePassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });

    it('TC-154: should reject password change if current password is wrong with 400', async () => {
      req.body = { currentPassword: 'wrongPassword', newPassword: 'newPassword123' };
      const mockUser = {
        _id: 'u123',
        password: 'hashedOldPassword'
      };

      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await userController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Current password is incorrect' });
    });
  });

  describe('getAlternateOptions', () => {
    it('TC-151: should fetch available alternate options in department', async () => {
      const mockUser = { _id: 'u123', department: 'd1', designation: 'Lecturer' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      User.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([{ _id: 'm1', name: 'Dr. Smith' }])
          })
        })
      });

      await userController.getAlternateOptions(req, res);

      expect(res.json).toHaveBeenCalledWith({ members: [{ _id: 'm1', name: 'Dr. Smith' }] });
    });
  });

  describe('getUserById', () => {
    it('TC-152: should fetch user profile details by ID', async () => {
      req.params = { id: 'u123' };
      const mockUser = { _id: 'u123', name: 'Alice', department: { name: 'CSE' } };

      User.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockUser)
        })
      });

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('TC-153: should return 404 for non-existent user ID', async () => {
      req.params = { id: 'invalid' };

      User.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});
