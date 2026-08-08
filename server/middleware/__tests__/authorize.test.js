const authorize = require('../authorize');

describe('authorize Middleware (TC-138 to TC-140)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('TC-138: should allow user with HR role when HR role is allowed', () => {
    req.user = { id: 'hr1', roles: ['HR'] };
    const middleware = authorize(['HR']);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('TC-139: should reject user with Employee role when HR is required with 403', () => {
    req.user = { id: 'emp1', roles: ['Employee'] };
    const middleware = authorize(['HR']);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Access denied') })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('TC-140: should reject request without authenticated user object with 401', () => {
    req.user = null;
    const middleware = authorize(['HR']);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated' });
    expect(next).not.toHaveBeenCalled();
  });
});
