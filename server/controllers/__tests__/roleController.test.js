const roleController = require('../roleController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('roleController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserRole', () => {
    it('should add HoD role to user if requested by HR', async () => {
      const req = {
        params: { userId: '123' },
        body: { action: 'add' },
        user: { roles: ['HR'] }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const mockUser = {
        _id: '123',
        name: 'Test',
        roles: ['Employee'],
        save: jest.fn()
      };
      
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser)
      });
      User.findOne.mockResolvedValue(null);

      await roleController.updateUserRole(req, res);

      expect(mockUser.roles).toContain('HoD');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should NOT allow non-HR users to update roles', async () => {
      // This test is expected to fail because of the bug we injected
      const req = {
        params: { userId: '123' },
        body: { action: 'add' },
        user: { roles: ['Employee'] } // Not HR
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock user.findById to avoid failing prematurely if bug is present
      User.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await roleController.updateUserRole(req, res);

      // We expect the controller to return 403 Forbidden
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only HR can assign roles' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users for HR', async () => {
      const req = { user: { roles: ['HR'] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUsers = [{ _id: '1', name: 'User 1', roles: ['Employee'] }];
      User.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUsers)
      });

      await roleController.getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
    });
  });
});
