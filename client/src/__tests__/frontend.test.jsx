import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';

jest.mock('../services/api', () => ({
  authAPI: { login: jest.fn(), register: jest.fn(), getProfile: jest.fn() },
  departmentAPI: { getAll: jest.fn(() => Promise.resolve({ data: { departments: [{ _id: 'dep-1', name: 'CSE' }] } })) },
}));

const renderLogin = (ctx = {}) => {
  const value = { login: jest.fn().mockResolvedValue({ success: true, user: { roles: ['Employee'] } }), user: null, loading: false, ...ctx };
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/hr/dashboard" element={<div>HR Dashboard</div>} />
          <Route path="/hod/dashboard" element={<div>HoD Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

const renderRegister = (ctx = {}) => {
  const value = { register: jest.fn().mockResolvedValue({ success: true }), user: null, loading: false, ...ctx };
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('frontend UI tests', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders login form fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows forgot password and register links on login page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register here/i })).toBeInTheDocument();
  });

  test('shows error message when login fails', async () => {
    const login = jest.fn().mockResolvedValue({ success: false, message: 'Invalid credentials' });
    renderLogin({ login });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'x@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test('calls the login handler for HR users', async () => {
    const login = jest.fn().mockResolvedValue({ success: true, user: { roles: ['HR'] } });
    renderLogin({ login });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'hr@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
  });

  test('renders register form fields', () => {
    renderRegister();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('rejects registration with a missing department', async () => {
    renderRegister();
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: 'Lecturer' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/^password \*$/i), { target: { value: 'Pass123' } });
    fireEvent.change(screen.getByLabelText(/^confirm password \*$/i), { target: { value: 'Pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/please select a department/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated users from protected routes', () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: false }}>
        <MemoryRouter initialEntries={['/secure']}>
          <Routes>
            <Route path="/secure" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders children for authenticated users on protected routes', () => {
    render(
      <AuthContext.Provider value={{ user: { roles: ['Employee'] }, loading: false }}>
        <MemoryRouter initialEntries={['/secure']}>
          <Routes>
            <Route path="/secure" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/secret/i)).toBeInTheDocument();
  });

  test('redirects users without matching role to the default route', () => {
    render(
      <AuthContext.Provider value={{ user: { roles: ['HR'] }, loading: false }}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path="/profile" element={<RoleBasedRoute allowedRoles={['Employee']}><div>Employee Page</div></RoleBasedRoute>} />
            <Route path="/hr/system-settings" element={<div>HR System Settings</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/hr system settings/i)).toBeInTheDocument();
  });
});
