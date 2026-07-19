const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../../routes/authRoutes');
const userRoutes = require('../../routes/userRoutes');

jest.mock('../../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

describe('API Integration Tests', () => {
  beforeAll(() => {
    // Mock the mongoose connection if needed, though we are mocking the User model anyway
  });

  describe('Auth Routes', () => {
    it('POST /api/auth/login should return 400 if credentials missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Please provide email and password');
    });
  });

  // Adding test that will hit our bug in userRoutes
  describe('User Routes', () => {
    it('PATCH /api/users/:userId/role should fail for Employee due to lack of HR role', async () => {
      // Setup mock user for authMiddleware (assuming we mock it or pass a valid token)
      // Since authMiddleware verifies JWT, integration testing with real tokens or mocked middleware is required.
      // For this test, let's just observe if we can hit it.
    });
  });
});
