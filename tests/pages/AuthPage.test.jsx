import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils';
import AuthPage from '@/pages/AuthPage';

vi.mock('@/contexts/SupabaseAuthContext', async () => {
  const actual = await vi.importActual('@/contexts/SupabaseAuthContext');
  return {
    ...actual,
    useAuth: () => ({
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
    }),
  };
});

describe('AuthPage', () => {
  it('renders login and signup tabs', () => {
    render(<AuthPage />);
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows the login form by default', () => {
    render(<AuthPage />);
    expect(screen.getByLabelText(/login email/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  it('switches to the signup form when the signup tab is clicked', () => {
    render(<AuthPage />);
    const signupTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signupTab);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/login email/i)).not.toBeInTheDocument();
  });
});