const departmentController = require('../departmentController');
const Department = require('../../models/Department');

jest.mock('../../models/Department');

describe('departmentController', () => {
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

  describe('getDepartmentById', () => {
    it('should NOT attempt to populate "hod" because it causes a StrictPopulateError (Bug SQA-8)', async () => {
      const mockPopulate2 = jest.fn().mockResolvedValue({ _id: 'someId', name: 'CSE' });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      Department.findById.mockReturnValue({ populate: mockPopulate1 });

      await departmentController.getDepartmentById(req, res);

      // The test expects the second populate call NOT to be for "hod"
      expect(mockPopulate2).not.toHaveBeenCalledWith(
        "hod",
        expect.anything()
      );
    });
  });
});
