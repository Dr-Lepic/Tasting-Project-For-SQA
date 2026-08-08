const hodDashboardController = require('../hodDashboardController');
const User = require('../../models/User');
const LeaveRequest = require('../../models/LeaveRequest');

jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');

describe('hodDashboardController (TC-111 to TC-113)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'hodUser123' }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TC-111: should fetch HoD dashboard stats successfully for valid department', async () => {
    const mockHod = {
      _id: 'hodUser123',
      department: { _id: 'dept123', name: 'CSE' }
    };
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockHod)
    });
    User.find.mockResolvedValue([
      { _id: 'mem1', name: 'Alice' },
      { _id: 'mem2', name: 'Bob' }
    ]);
    LeaveRequest.countDocuments
      .mockResolvedValueOnce(1) // activeLeavesCount
      .mockResolvedValueOnce(1); // pendingRequests
    LeaveRequest.find.mockResolvedValue([
      { status: 'Approved' },
      { status: 'Declined' }
    ]);
    LeaveRequest.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: 'req1' })
        })
      })
    });

    await hodDashboardController.getHoDDashboardStats(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        memberStats: {
          totalMembers: 2,
          activeMembers: 1,
          membersOnLeave: 1
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

  it('TC-112: should return 404 if HoD user has no associated department', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await hodDashboardController.getHoDDashboardStats(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Department not found' });
  });

  it('TC-113: should handle internal database error with 500 status', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('DB failure'))
    });

    await hodDashboardController.getHoDDashboardStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Server error' })
    );
  });
});
