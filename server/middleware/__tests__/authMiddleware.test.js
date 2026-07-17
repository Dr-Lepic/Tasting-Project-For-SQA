const jwt = require('jsonwebtoken');
const authMiddleware = require('../authMiddleware');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  test('returns 401 when no token is present', () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(next).not.toHaveBeenCalled();
  });

  test('attaches decoded user and calls next for a valid token', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const decoded = { id: 'user-1', roles: ['Employee'] };

    jwt.verify.mockReturnValueOnce(decoded);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  test('returns 401 when the token is invalid', () => {
    const req = { header: jest.fn().mockReturnValue('Bearer invalid-token') };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementationOnce(() => {
      throw new Error('bad token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });
});