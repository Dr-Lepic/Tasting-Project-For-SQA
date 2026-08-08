const leaveQuotaController = require('../leaveQuotaController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('leaveQuotaController (TC-155 to TC-157)', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { id: 'u1', roles: ['HR'] },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getLeaveQuotaSettings', () => {
    it('TC-155: should fetch reference leave quota settings', async () => {
      const mockQuota = { annual: { allocated: 20 }, casual: { allocated: 10 } };
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ leaveQuota: mockQuota })
      });

      await leaveQuotaController.getLeaveQuotaSettings(req, res);

      expect(res.json).toHaveBeenCalledWith({ settings: { annual: 20, casual: 10 } });
    });
  });

  describe('updateUserLeaveQuota', () => {
    it('TC-156: should allow HR to update individual user quota', async () => {
      req.params = { userId: 'u1' };
      req.body = { annual: 25, casual: 12 };
      const updatedUser = {
        _id: 'u1',
        leaveQuota: { annual: { allocated: 25, used: 0 }, casual: { allocated: 12, used: 0 } }
      };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUser)
      });

      await leaveQuotaController.updateUserLeaveQuota(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'User leave quota updated successfully',
        leaveQuota: updatedUser.leaveQuota
      });
    });

    it('should return 404 if user not found for quota update', async () => {
      req.params = { userId: 'invalid' };
      req.body = { annual: 25 };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await leaveQuotaController.updateUserLeaveQuota(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('updateLeaveQuotaForAll', () => {
    it('TC-157: should update quota for all users if requested by HR', async () => {
      req.body = { annual: 20, casual: 10 };
      User.updateMany.mockResolvedValue({ modifiedCount: 5 });

      await leaveQuotaController.updateLeaveQuotaForAll(req, res);

      expect(User.updateMany).toHaveBeenCalledWith({}, {
        $set: {
          'leaveQuota.annual.allocated': 20,
          'leaveQuota.casual.allocated': 10
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Leave quota updated for 5 users',
        updatedCount: 5,
        settings: { annual: 20, casual: 10 }
      });
    });

    it('should return 400 if annual or casual is missing', async () => {
      req.body = { annual: 20 };

      await leaveQuotaController.updateLeaveQuotaForAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Annual and casual leave days are required' });
    });
  });

  describe('resetUsedLeaveQuota', () => {
    it('should reset used quota to 0 for all users', async () => {
      User.updateMany.mockResolvedValue({ modifiedCount: 5 });

      await leaveQuotaController.resetUsedLeaveQuota(req, res);

      expect(User.updateMany).toHaveBeenCalledWith({}, {
        $set: {
          'leaveQuota.annual.used': 0,
          'leaveQuota.casual.used': 0
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Leave quota reset for 5 users',
        resetCount: 5
      });
    });
  });
});
