import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock the api module
vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
  },
  default: { get: vi.fn(), post: vi.fn() },
}));

import { authAPI } from '../../services/api';

const TestConsumer = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <button onClick={() => login({ email: 'test@test.com', password: 'pass' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with no user', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('sets user after successful login', async () => {
    authAPI.login.mockResolvedValue({
      data: { data: { token: 'tok123', user: { id: '1', email: 'test@test.com', role: 'citizen' } } }
    });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });

    expect(screen.getByTestId('user').textContent).toBe('test@test.com');
    expect(localStorage.getItem('token')).toBe('tok123');
  });

  it('clears user after logout', async () => {
    authAPI.login.mockResolvedValue({
      data: { data: { token: 'tok123', user: { id: '1', email: 'test@test.com', role: 'citizen' } } }
    });

    render(<AuthProvider><TestConsumer /></AuthProvider>);

    await act(async () => { await userEvent.click(screen.getByText('Login')); });
    await act(async () => { await userEvent.click(screen.getByText('Logout')); });

    expect(screen.getByTestId('user').textContent).toBe('none');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
