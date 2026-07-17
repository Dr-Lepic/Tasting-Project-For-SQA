import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const renderLogin = (loginMock) =>
  render(
    <AuthContext.Provider value={{ login: loginMock }}>
      <Login />
    </AuthContext.Provider>
  );

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('redirects HR users to the HR dashboard after successful login', async () => {
    const loginMock = jest.fn().mockResolvedValue({
      success: true,
      user: { roles: ['HR'] },
    });

    renderLogin(loginMock);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'hr@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password1' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/hr/dashboard'));
  });

  test('shows an error message when login fails', async () => {
    const loginMock = jest.fn().mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
    });

    renderLogin(loginMock);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'user@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  test('redirects HoD users to the HoD dashboard after successful login', async () => {
    const loginMock = jest.fn().mockResolvedValue({
      success: true,
      user: { roles: ['HoD'] },
    });

    renderLogin(loginMock);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'hod@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password1' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/hod/dashboard'));
  });

  test('redirects Employee users to profile after successful login', async () => {
    const loginMock = jest.fn().mockResolvedValue({
      success: true,
      user: { roles: ['Employee'] },
    });

    renderLogin(loginMock);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'emp@iut-dhaka.edu' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password1' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/profile'));
  });

  test('shows forgot password link', () => {
    renderLogin(jest.fn());
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });

  test('shows register link', () => {
    renderLogin(jest.fn());
    expect(screen.getByText('Register here')).toBeInTheDocument();
  });
});