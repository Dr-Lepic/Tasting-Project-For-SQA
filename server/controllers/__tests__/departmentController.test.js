const departmentController = require('../departmentController');
const Department = require('../../models/Department');

jest.mock('../../models/Department');

describe('departmentController (TC-158 to TC-160)', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'someId' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDepartments', () => {
    it('TC-158: should return all departments list', async () => {
      const mockDepts = [{ _id: 'd1', name: 'CSE' }, { _id: 'd2', name: 'EEE' }];
      Department.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDepts)
      });

      await departmentController.getAllDepartments(req, res);

      expect(res.json).toHaveBeenCalledWith({ departments: mockDepts });
    });

    it('TC-159: should return 500 when database error occurs during getAllDepartments', async () => {
      Department.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB failure'))
      });

      await departmentController.getAllDepartments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getDepartmentById', () => {
    it('TC-160: should return 404 if department ID is not found', async () => {
      const mockPopulate2 = jest.fn().mockResolvedValue(null);
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      Department.findById.mockReturnValue({ populate: mockPopulate1 });

      await departmentController.getDepartmentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department not found' });
    });
  });
});
