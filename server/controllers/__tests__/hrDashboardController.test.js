const hrDashboardController = require('../hrDashboardController');
const User = require('../../models/User');
const LeaveRequest = require('../../models/LeaveRequest');
const Department = require('../../models/Department');

jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');
jest.mock('../../models/Department');

describe('hrDashboardController (TC-114 to TC-115)', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 'hrUser123', roles: ['HR'] } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TC-114: should fetch organization-wide HR dashboard statistics', async () => {
    Department.find.mockResolvedValue([{ _id: 'd1' }, { _id: 'd2' }]);
    User.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { _id: 'u1', name: 'User 1' },
        { _id: 'u2', name: 'User 2' }
      ])
    });
    LeaveRequest.find
      .mockResolvedValueOnce([{ _id: 'l1' }]) // activeLeaves
      .mockResolvedValueOnce([                // monthlyRequests
        { status: 'Approved' },
        { status: 'Declined' }
      ]);
    LeaveRequest.countDocuments.mockResolvedValue(1); // pendingRequests
    LeaveRequest.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: 'l1' })
        })
      })
    });

    await hrDashboardController.getHRDashboardStats(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        memberStats: {
          totalMembers: 2,
          activeMembers: 1,
          membersOnLeave: 1,
          totalDepartments: 2
        },
        requestStats: {
          totalRequests: 2,
          acceptedRequests: 1,
          declinedRequests: 1,
          pendingRequests: 1
        }
      })
    );
  });

  it('TC-115: should handle internal database error with 500 status', async () => {
    Department.find.mockRejectedValue(new Error('DB failure'));

    await hrDashboardController.getHRDashboardStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Server error' })
    );
  });
});
