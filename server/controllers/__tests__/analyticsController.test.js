const { getHoDAnalytics, getHRAnalytics } = require('../analyticsController');
const User = require('../../models/User');
const LeaveRequest = require('../../models/LeaveRequest');
const Department = require('../../models/Department');

jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');
jest.mock('../../models/Department');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe('analyticsController (TC-92, TC-126 to TC-131)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC-92: getHoDAnalytics with null department triggers error handling', async () => {
    const hodUserWithoutDepartment = {
      _id: 'hod-1',
      name: 'HoD Without Dept',
      roles: ['HoD'],
      department: null,
      hasRole: jest.fn((role) => role === 'HoD')
    };

    User.findById.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(hodUserWithoutDepartment)
    });

    const req = {
      user: { id: 'hod-1' },
      query: { period: 'monthly' }
    };
    const res = makeRes();

    await getHoDAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('TC-126: getHRAnalytics should fetch overall analytics for HR user', async () => {
    const hrUser = {
      _id: 'hr-1',
      roles: ['HR'],
      hasRole: jest.fn((role) => role === 'HR')
    };
    User.findById.mockResolvedValue(hrUser);
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([
          {
            _id: 'l1',
            status: 'Approved',
            type: 'Casual',
            numberOfDays: 2,
            employee: { _id: 'e1', name: 'Alice' },
            department: { _id: 'd1', name: 'CSE' }
          }
        ])
      })
    });
    Department.find.mockResolvedValue([{ _id: 'd1', name: 'CSE' }]);
    User.countDocuments.mockResolvedValue(5);

    const req = {
      user: { id: 'hr-1' },
      query: { period: 'monthly', departmentId: 'all' }
    };
    const res = makeRes();

    await getHRAnalytics(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: expect.objectContaining({
          totalRequests: 1,
          approved: 1
        })
      })
    );
  });

  test('TC-127: getHRAnalytics should reject non-HR requester with 403', async () => {
    const empUser = {
      _id: 'emp-1',
      roles: ['Employee'],
      hasRole: jest.fn(() => false)
    };
    User.findById.mockResolvedValue(empUser);

    const req = {
      user: { id: 'emp-1' },
      query: {}
    };
    const res = makeRes();

    await getHRAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized access' });
  });

  test('TC-128: getHoDAnalytics should fetch department analytics for valid HoD', async () => {
    const hodUser = {
      _id: 'hod-1',
      roles: ['HoD'],
      department: { _id: 'd1', name: 'CSE' },
      hasRole: jest.fn((role) => role === 'HoD')
    };

    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(hodUser)
    });

    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: 'l1',
          status: 'Approved',
          type: 'Annual',
          numberOfDays: 3,
          createdAt: new Date(),
          approvedByHoD: true,
          waitingForAlternate: false,
          employee: { _id: 'e1', name: 'Bob', designation: 'Lecturer' }
        }
      ])
    });

    const req = {
      user: { id: 'hod-1' },
      query: { period: 'monthly' }
    };
    const res = makeRes();

    await getHoDAnalytics(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: expect.objectContaining({
          totalRequests: 1,
          approved: 1
        })
      })
    );
  });

  test('TC-129: getHoDAnalytics should reject unauthorized non-HoD user with 403', async () => {
    const empUser = {
      _id: 'emp-1',
      roles: ['Employee'],
      hasRole: jest.fn(() => false)
    };
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(empUser)
    });

    const req = {
      user: { id: 'emp-1' },
      query: {}
    };
    const res = makeRes();

    await getHoDAnalytics(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('TC-130: getHRAnalytics with yearly period should produce monthly breakdown', async () => {
    const hrUser = {
      _id: 'hr-1',
      roles: ['HR'],
      hasRole: jest.fn((role) => role === 'HR')
    };
    User.findById.mockResolvedValue(hrUser);
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      })
    });
    Department.find.mockResolvedValue([]);

    const req = {
      user: { id: 'hr-1' },
      query: { period: 'yearly', year: '2026' }
    };
    const res = makeRes();

    await getHRAnalytics(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        monthlyBreakdown: expect.arrayContaining([
          expect.objectContaining({ month: 1 })
        ])
      })
    );
  });

  test('TC-131: getHoDAnalytics with yearly period should produce monthly breakdown for department', async () => {
    const hodUser = {
      _id: 'hod-1',
      roles: ['HoD'],
      department: { _id: 'd1', name: 'CSE' },
      hasRole: jest.fn((role) => role === 'HoD')
    };
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(hodUser)
    });
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([])
    });

    const req = {
      user: { id: 'hod-1' },
      query: { period: 'yearly', year: '2026' }
    };
    const res = makeRes();

    await getHoDAnalytics(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        monthlyBreakdown: expect.arrayContaining([
          expect.objectContaining({ month: 1 })
        ])
      })
    );
  });
});
