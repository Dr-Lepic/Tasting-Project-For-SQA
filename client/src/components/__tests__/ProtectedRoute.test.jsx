import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => {
  const React = require('react');
  return { AuthContext: React.createContext() };
});

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));

const renderRoute = (user, loading = false) =>
  render(
    <AuthContext.Provider value={{ user, loading }}>
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>
    </AuthContext.Provider>
  );

describe('ProtectedRoute', () => {
  test('shows loading screen while auth is loading', () => {
    renderRoute(null, true);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects unauthenticated users to login', () => {
    renderRoute(null, false);
    expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
  });

  test('renders children for authenticated users', () => {
    renderRoute({ roles: ['Employee'] }, false);
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });
});