import { render, screen } from '@testing-library/react';
import RoleBasedRoute from '../RoleBasedRoute';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));

const renderWithAuth = (user, loading = false, allowedRoles = ['Employee']) =>
  render(
    <AuthContext.Provider value={{ user, loading }}>
      <RoleBasedRoute allowedRoles={allowedRoles}>
        <div>Protected Content</div>
      </RoleBasedRoute>
    </AuthContext.Provider>
  );

describe('RoleBasedRoute', () => {
  test('shows loading state while auth context is loading', () => {
    renderWithAuth(null, true);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects unauthenticated users to login', () => {
    renderWithAuth(null, false);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
  });

  test('renders children for an allowed role', () => {
    renderWithAuth({ roles: ['Employee'] }, false, ['Employee']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects HR users to HR settings when role is not allowed', () => {
    renderWithAuth({ roles: ['HR'] }, false, ['Employee']);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/hr/system-settings');
  });

  test('redirects HoD users to HoD dashboard when role is not allowed', () => {
    renderWithAuth({ roles: ['HoD'] }, false, ['Employee']);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/hod/dashboard');
  });

  test('redirects Employee users to profile when role is not allowed', () => {
    renderWithAuth({ roles: ['Employee'] }, false, ['HR']);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/profile');
  });

  test('renders children when multiple allowed roles include the user role', () => {
    renderWithAuth({ roles: ['HoD'] }, false, ['Employee', 'HoD']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders children for HR when HR is explicitly allowed', () => {
    renderWithAuth({ roles: ['HR'] }, false, ['HR']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});