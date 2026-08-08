const leaveController = require('../leaveController');
const LeaveRequest = require('../../models/LeaveRequest');
const LeaveHistoryLog = require('../../models/LeaveHistoryLog');
const AlternateRequest = require('../../models/AlternateRequest');
const User = require('../../models/User');
const Vacation = require('../../models/Vacation');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');

jest.mock('../../models/LeaveRequest');
jest.mock('../../models/LeaveHistoryLog');
jest.mock('../../models/AlternateRequest');
jest.mock('../../models/User');
jest.mock('../../models/Vacation');
jest.mock('../../utils/cloudinaryUpload');
jest.mock('../../utils/emailService', () => ({
  sendAlternateRequestEmail: jest.fn(),
  sendApplicationStatusEmail: jest.fn(),
  sendHoDReviewEmail: jest.fn(),
  sendHRReviewEmail: jest.fn()
}));

const makeRes = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });

const makeUserMock = (overrides = {}) => {
  const user = {
    _id: 'u1',
    name: 'Test User',
    email: 'test@iut-dhaka.edu',
    roles: ['Employee'],
    department: { _id: 'd1', name: 'CSE' },
    leaveQuota: { annual: { allocated: 20, used: 0 }, casual: { allocated: 10, used: 0 } },
    hasRole: jest.fn(r => (user.roles || []).includes(r)),
    updateLeaveStatus: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
    ...overrides
  };
  return user;
};

const setupUserFindByIdMock = (user) => {
  const chain = {};
  chain.populate = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.lean = jest.fn().mockResolvedValue(user);
  chain.then = (resolve) => resolve(user);
  User.findById.mockImplementation(() => chain);
};

describe('leaveController Additional Tests (TC-141 to TC-150)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Vacation.find.mockResolvedValue([]);
  });

  it('TC-141: applyLeave with Medical purpose missing attachment returns 400', async () => {
    setupUserFindByIdMock(makeUserMock());

    const req = {
      user: { id: 'u1' },
      body: {
        startDate: '2026-07-01',
        endDate: '2026-07-02',
        type: 'Annual',
        reason: 'Medical Treatment',
        predefinedPurposes: JSON.stringify(['Medical'])
      },
      file: undefined
    };
    const res = makeRes();

    await leaveController.applyLeave(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('mandatory') })
    );
  });

  it('TC-142: applyLeave with valid document attachment succeeds with 201', async () => {
    setupUserFindByIdMock(makeUserMock());
    User.findOne.mockResolvedValue({ name: 'HoD', email: 'hod@iut-dhaka.edu' });
    uploadToCloudinary.mockResolvedValue('https://res.cloudinary.com/doc.pdf');

    LeaveRequest.prototype.save = jest.fn().mockResolvedValue(true);
    LeaveHistoryLog.prototype.save = jest.fn().mockResolvedValue(true);

    const req = {
      user: { id: 'u1' },
      body: {
        startDate: '2026-07-01',
        endDate: '2026-07-02',
        type: 'Annual',
        reason: 'Medical Treatment',
        predefinedPurposes: JSON.stringify(['Medical'])
      },
      file: { buffer: Buffer.from('fake pdf') }
    };
    const res = makeRes();

    await leaveController.applyLeave(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Leave application submitted successfully' })
    );
  });

  it('TC-143: updateLeaveStatus allows HoD to approve pending leave request', async () => {
    const mockLeave = {
      _id: 'l1',
      status: 'Pending',
      approvedByHoD: false,
      waitingForAlternate: false,
      employee: 'e1',
      department: 'd1',
      save: jest.fn().mockResolvedValue(true)
    };
    setupUserFindByIdMock(makeUserMock({ _id: 'hod1', roles: ['HoD'] }));
    User.findOne.mockResolvedValue({ name: 'HR', email: 'hr@iut-dhaka.edu' });
    LeaveRequest.findById.mockResolvedValue(mockLeave);
    LeaveHistoryLog.prototype.save = jest.fn().mockResolvedValue(true);

    const req = {
      user: { id: 'hod1' },
      params: { leaveId: 'l1' },
      body: { action: 'approve', remarks: 'Looks good' }
    };
    const res = makeRes();

    await leaveController.updateLeaveStatus(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('approved') })
    );
  });

  it('TC-144: updateLeaveStatus allows HoD to decline pending leave request', async () => {
    const mockLeave = {
      _id: 'l1',
      status: 'Pending',
      approvedByHoD: false,
      waitingForAlternate: false,
      employee: 'e1',
      department: 'd1',
      save: jest.fn().mockResolvedValue(true)
    };
    setupUserFindByIdMock(makeUserMock({ _id: 'hod1', roles: ['HoD'] }));
    LeaveRequest.findById.mockResolvedValue(mockLeave);
    LeaveHistoryLog.prototype.save = jest.fn().mockResolvedValue(true);

    const req = {
      user: { id: 'hod1' },
      params: { leaveId: 'l1' },
      body: { action: 'decline', remarks: 'Project deadline' }
    };
    const res = makeRes();

    await leaveController.updateLeaveStatus(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('declined') })
    );
  });

  it('TC-145: updateLeaveStatus rejects invalid action string with 400', async () => {
    setupUserFindByIdMock(makeUserMock({ _id: 'emp1', roles: ['Employee'] }));
    LeaveRequest.findById.mockResolvedValue({ _id: 'l1' });

    const req = {
      user: { id: 'emp1' },
      params: { leaveId: 'l1' },
      body: { action: 'invalid_action' }
    };
    const res = makeRes();

    await leaveController.updateLeaveStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid action' });
  });

  it('TC-146: respondToAlternateRequest updates alternate status to Accepted on ok', async () => {
    const mockAltReq = {
      _id: 'alt1',
      alternate: { toString: () => 'u1' },
      status: 'pending',
      leaveRequest: {
        _id: 'l1',
        alternateEmployees: [{ employee: { toString: () => 'u1' }, status: 'Pending' }],
        save: jest.fn().mockResolvedValue(true)
      },
      save: jest.fn().mockResolvedValue(true)
    };
    AlternateRequest.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAltReq)
    });
    LeaveRequest.findById.mockResolvedValue({
      _id: 'l1',
      alternateEmployees: [{ employee: { toString: () => 'u1' }, status: 'Pending' }],
      save: jest.fn().mockResolvedValue(true)
    });
    AlternateRequest.find.mockResolvedValue([]);
    setupUserFindByIdMock(makeUserMock({ _id: 'u1' }));

    const req = {
      user: { id: 'u1' },
      params: { requestId: 'alt1' },
      body: { response: 'ok' }
    };
    const res = makeRes();

    await leaveController.respondToAlternateRequest(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('accepted') })
    );
  });

  it('TC-147: respondToAlternateRequest updates alternate status to Declined on sorry', async () => {
    const mockAltReq = {
      _id: 'alt1',
      alternate: { toString: () => 'u1' },
      status: 'pending',
      leaveRequest: {
        _id: 'l1',
        alternateEmployees: [{ employee: { toString: () => 'u1' }, status: 'Pending' }],
        save: jest.fn().mockResolvedValue(true)
      },
      save: jest.fn().mockResolvedValue(true)
    };
    AlternateRequest.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAltReq)
    });
    LeaveRequest.findById.mockResolvedValue({
      _id: 'l1',
      alternateEmployees: [{ employee: { toString: () => 'u1' }, status: 'Pending' }],
      save: jest.fn().mockResolvedValue(true)
    });
    setupUserFindByIdMock(makeUserMock({ _id: 'u1' }));

    const req = {
      user: { id: 'u1' },
      params: { requestId: 'alt1' },
      body: { response: 'sorry' }
    };
    const res = makeRes();

    await leaveController.respondToAlternateRequest(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('declined') })
    );
  });

  it('TC-148: getMyApplications fetches user leave applications list', async () => {
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([{ _id: 'l1', status: 'Pending' }])
          })
        })
      })
    });

    const req = {
      user: { id: 'u1' }
    };
    const res = makeRes();

    await leaveController.getMyApplications(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ applications: expect.arrayContaining([expect.anything()]) })
    );
  });

  it('TC-149: getFilteredApplications returns department leave history for HoD', async () => {
    setupUserFindByIdMock(makeUserMock({ _id: 'hod1', roles: ['HoD'] }));
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue([{ _id: 'e1' }])
    });
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue([{ _id: 'l1', toObject: () => ({ _id: 'l1' }) }])
              })
            })
          })
        })
      })
    });

    const req = {
      user: { id: 'hod1', roles: ['HoD'] },
      query: { period: 'yearly', year: '2026' }
    };
    const res = makeRes();

    await leaveController.getFilteredApplications(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ applications: expect.arrayContaining([expect.anything()]) })
    );
  });

  it('TC-150: getPendingApprovals returns pending requests for HR', async () => {
    setupUserFindByIdMock(makeUserMock({ _id: 'hr1', roles: ['HR'] }));
    LeaveRequest.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([{ _id: 'l1', status: 'Pending', approvedByHoD: true }])
            })
          })
        })
      })
    });

    const req = {
      user: { id: 'hr1', roles: ['HR'] }
    };
    const res = makeRes();

    await leaveController.getPendingApprovals(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ pendingApprovals: expect.arrayContaining([expect.anything()]) })
    );
  });
});
