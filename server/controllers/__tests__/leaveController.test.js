const leaveController = require('../leaveController');
const LeaveRequest = require('../../models/LeaveRequest');
const LeaveHistoryLog = require('../../models/LeaveHistoryLog');
const AlternateRequest = require('../../models/AlternateRequest');
const User = require('../../models/User');
const Vacation = require('../../models/Vacation');

jest.mock('../../models/LeaveRequest');
jest.mock('../../models/LeaveHistoryLog');
jest.mock('../../models/AlternateRequest');
jest.mock('../../models/User');
jest.mock('../../models/Vacation');
jest.mock('../../utils/cloudinaryUpload', () => ({ uploadToCloudinary: jest.fn() }));
jest.mock('../../utils/emailService', () => ({
  sendAlternateRequestEmail: jest.fn(),
  sendApplicationStatusEmail: jest.fn(),
  sendHoDReviewEmail: jest.fn(),
  sendHRReviewEmail: jest.fn(),
}));

const makeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
const makeUser = (roles = ['Employee'], overrides = {}) => ({
  _id: 'user-1',
  name: 'Test User',
  email: 'test@iut-dhaka.edu',
  designation: 'Lecturer',
  roles,
  department: { _id: 'dep-1', name: 'CSE' },
  leaveQuota: { annual: { allocated: 20, used: 0 }, casual: { allocated: 10, used: 0 } },
  hasRole: jest.fn((role) => roles.includes(role)),
  ...overrides,
});
const mockPopulateUser = (user) => {
  User.findById.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(user) });
};
const mockQueryChain = (result, populateCount = 3) => {
  const build = (count) => ({
    populate: jest.fn(() => (count > 1 ? build(count - 1) : { sort: jest.fn().mockResolvedValue(result) })),
  });
  return build(populateCount);
};

describe('leaveController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    LeaveRequest.prototype.save = jest.fn().mockResolvedValue(true);
    LeaveHistoryLog.prototype.save = jest.fn().mockResolvedValue(true);
    AlternateRequest.insertMany = jest.fn().mockResolvedValue(true);
    Vacation.find.mockResolvedValue([]);
  });

  test('applyLeave rejects missing required fields', async () => {
    const req = { user: { id: 'user-1' }, body: { startDate: '', endDate: '', type: '' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('applyLeave rejects reversed dates', async () => {
    mockPopulateUser(makeUser());
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-10', endDate: '2026-07-01', type: 'Annual' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('applyLeave rejects when user is missing', async () => {
    mockPopulateUser(null);
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-01', endDate: '2026-07-02', type: 'Annual', reason: 'Personal' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('applyLeave rejects casual leave over 2 days', async () => {
    mockPopulateUser(makeUser());
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-01', endDate: '2026-07-03', type: 'Casual', numberOfDays: 3, reason: 'Personal' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('applyLeave rejects insufficient annual quota', async () => {
    mockPopulateUser(makeUser(['Employee'], { leaveQuota: { annual: { allocated: 1, used: 1 }, casual: { allocated: 10, used: 0 } } }));
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-01', endDate: '2026-07-02', type: 'Annual' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('applyLeave rejects annual leave without purpose', async () => {
    mockPopulateUser(makeUser());
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-01', endDate: '2026-07-02', type: 'Annual', reason: '' } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('applyLeave rejects document-required annual leave without file', async () => {
    mockPopulateUser(makeUser());
    const req = { user: { id: 'user-1' }, body: { startDate: '2026-07-01', endDate: '2026-07-02', type: 'Annual', reason: 'Conference', predefinedPurposes: JSON.stringify(['Conference']) } };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('applyLeave creates leave and alternate requests', async () => {
    mockPopulateUser(makeUser());
    User.findById.mockResolvedValueOnce({ _id: 'alt-1', email: 'alt@iut-dhaka.edu', name: 'Alt User' });
    LeaveRequest.mockImplementation(function (data) { Object.assign(this, data); this._id = 'leave-1'; });
    const req = {
      user: { id: 'user-1' },
      body: { startDate: '2026-07-01', endDate: '2026-07-02', type: 'Annual', reason: 'Medical', predefinedPurposes: JSON.stringify(['Medical']), alternateEmployeeIds: JSON.stringify([{ employeeId: 'alt-1', startDate: '2026-07-01', endDate: '2026-07-02' }]) },
    };
    const res = makeRes();
    await leaveController.applyLeave(req, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('getMyApplications returns user applications', async () => {
    LeaveRequest.find.mockReturnValue(mockQueryChain([{ _id: 'leave-1' }], 3));
    const res = makeRes();
    await leaveController.getMyApplications({ user: { id: 'user-1' } }, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('getMyHistory returns finalized applications', async () => {
    LeaveRequest.find.mockReturnValue(mockQueryChain([{ _id: 'leave-2' }], 3));
    const res = makeRes();
    await leaveController.getMyHistory({ user: { id: 'user-1' } }, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('getLeaveHistory rejects missing user', async () => {
    User.findById.mockResolvedValueOnce(null);
    const res = makeRes();
    await leaveController.getLeaveHistory({ user: { id: 'user-1' } }, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('getPendingApprovals rejects unauthorized employee', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['Employee']));
    const res = makeRes();
    await leaveController.getPendingApprovals({ user: { id: 'user-1' } }, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('getPendingApprovals returns HoD data', async () => {
    const hod = makeUser(['HoD']);
    User.findById.mockResolvedValueOnce(hod);
    User.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'emp-1' }]) });
    LeaveRequest.find.mockReturnValue(mockQueryChain([{ _id: 'leave-3' }], 4));
    const res = makeRes();
    await leaveController.getPendingApprovals({ user: { id: 'user-1' } }, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('updateLeaveStatus rejects missing leave request', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['HoD']));
    LeaveRequest.findById.mockResolvedValueOnce(null);
    const res = makeRes();
    await leaveController.updateLeaveStatus({ user: { id: 'user-1' }, params: { leaveId: 'leave-1' }, body: { action: 'approve' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('updateLeaveStatus rejects duplicate HoD approval', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['HoD']));
    LeaveRequest.findById.mockResolvedValueOnce({ _id: 'leave-1', approvedByHoD: true });
    const res = makeRes();
    await leaveController.updateLeaveStatus({ user: { id: 'user-1' }, params: { leaveId: 'leave-1' }, body: { action: 'approve' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updateLeaveStatus approves as HoD', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['HoD']));
    User.findOne.mockResolvedValueOnce({ email: 'hr@iut-dhaka.edu', name: 'HR' });
    User.findById.mockResolvedValueOnce({ populate: jest.fn().mockResolvedValue(makeUser()) });
    const leave = { _id: 'leave-1', employee: 'user-2', approvedByHoD: false, save: jest.fn().mockResolvedValue(true) };
    LeaveRequest.findById.mockResolvedValueOnce(leave);
    const res = makeRes();
    await leaveController.updateLeaveStatus({ user: { id: 'user-1' }, params: { leaveId: 'leave-1' }, body: { action: 'approve' } }, res);
    expect(leave.approvedByHoD).toBe(true);
  });

  test('updateLeaveStatus declines as HoD', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['HoD']));
    LeaveRequest.findById.mockResolvedValueOnce({ _id: 'leave-1', save: jest.fn().mockResolvedValue(true) });
    const res = makeRes();
    await leaveController.updateLeaveStatus({ user: { id: 'user-1' }, params: { leaveId: 'leave-1' }, body: { action: 'decline' } }, res);
    expect(res.status).toHaveBeenCalled();
  });

  test('updateLeaveStatus rejects invalid stage for employee', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['Employee']));
    LeaveRequest.findById.mockResolvedValueOnce({ _id: 'leave-1' });
    const res = makeRes();
    await leaveController.updateLeaveStatus({ user: { id: 'user-1' }, params: { leaveId: 'leave-1' }, body: { action: 'approve' } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('TC-90: getMemberHistory should reject access by non-HoD/non-HR regular employee', async () => {
    User.findById.mockResolvedValueOnce(makeUser(['Employee']));
    LeaveRequest.find.mockReturnValue(mockQueryChain([{ _id: 'leave-private' }], 3));
    const res = makeRes();
    await leaveController.getMemberHistory({ user: { id: 'user-1' }, params: { userId: 'user-2' } }, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});