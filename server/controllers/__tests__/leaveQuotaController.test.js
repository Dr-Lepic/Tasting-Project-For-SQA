const leaveQuotaController = require('../leaveQuotaController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('leaveQuotaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateLeaveQuotaForAll', () => {
    it('should update quota for all users if requested by HR', async () => {
      const req = {
        user: { roles: ['HR'] },
        body: { annual: 20, casual: 10 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.updateMany.mockResolvedValue({ modifiedCount: 5 });

      await leaveQuotaController.updateLeaveQuotaForAll(req, res);

      expect(User.updateMany).toHaveBeenCalledWith({}, {
        $set: {
          'leaveQuota.annual.allocated': 20,
          'leaveQuota.casual.allocated': 10
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Leave quota updated for 5 users'
      });
    });

    it('should deny access to non-HR users', async () => {
      // Testing the bug that employees might be able to access this
      const req = {
        user: { roles: ['Employee'] },
        body: { annual: 20, casual: 10 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await leaveQuotaController.updateLeaveQuotaForAll(req, res);

      // It should actually be checked in the middleware or controller.
      // Assuming the bug Regression test expects 403.
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('resetUsedLeaveQuota', () => {
    it('should reset used quota to 0 for all users', async () => {
      const req = {
        user: { roles: ['HR'] }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.updateMany.mockResolvedValue({ modifiedCount: 5 });

      await leaveQuotaController.resetUsedLeaveQuota(req, res);

      expect(User.updateMany).toHaveBeenCalledWith({}, {
        $set: {
          'leaveQuota.annual.used': 0,
          'leaveQuota.casual.used': 0
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Leave quotas have been reset for the new year'
      });
    });
  });
});
