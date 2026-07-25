const { getHoDAnalytics } = require('../analyticsController');
const User = require('../../models/User');
const LeaveRequest = require('../../models/LeaveRequest');

jest.mock('../../models/User');
jest.mock('../../models/LeaveRequest');
jest.mock('../../models/Department');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
});

describe('analyticsController bug tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('TC-92: getHoDAnalytics should handle missing HoD department gracefully instead of throwing 500 TypeError', async () => {
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

    // Expected graceful response (e.g. 400 Bad Request or 404 Not Found), not 500 Server Error
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
