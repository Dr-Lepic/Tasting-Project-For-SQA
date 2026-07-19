const userController = require('../userController');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user details if found', async () => {
      const req = { params: { id: '123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
      const mockUser = { _id: '123', name: 'Test' };

      User.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockUser)
        })
      });

      await userController.getUserById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: '999' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

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

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const req = {
        user: { id: '123' },
        body: { name: 'Updated Name', designation: 'Professor' },
        file: null
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const mockUser = {
        _id: '123',
        name: 'Old Name',
        designation: 'Lecturer',
        save: jest.fn()
      };

      User.findById.mockResolvedValue(mockUser);

      await userController.updateProfile(req, res);

      expect(mockUser.name).toBe('Updated Name');
      expect(mockUser.designation).toBe('Professor');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });
});
