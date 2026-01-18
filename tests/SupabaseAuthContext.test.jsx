import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { MemoryRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n.js';

// Mock child component to use the context
const AuthConsumer = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{user ? `User: ${user.email}` : 'No user'}</div>;
};

const TestApp = ({ children }) => (
  <MemoryRouter>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  </MemoryRouter>
);

// Mocks
vi.mock('@/lib/customSupabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    rpc: vi.fn(),
  },
}));
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('SupabaseAuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    render(
      <TestApp>
        <AuthConsumer />
      </TestApp>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show "No user" when there is no session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    await act(async () => {
      render(
        <TestApp>
          <AuthConsumer />
        </TestApp>
      );
    });
    expect(await screen.findByText('No user')).toBeInTheDocument();
  });

  it('should display user email when a session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser };
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });
    supabase.rpc.mockResolvedValue({ data: { id: '123', email: 'test@example.com', team_memberships: [] } });

    await act(async () => {
      render(
        <TestApp>
          <AuthConsumer />
        </TestApp>
      );
    });
    
    expect(await screen.findByText('User: test@example.com')).toBeInTheDocument();
    expect(supabase.rpc).toHaveBeenCalledWith('get_user_profile', { user_id_input: '123' });
  });

  it('should handle onAuthStateChange correctly', async () => {
    let onAuthStateChangeCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
        onAuthStateChangeCallback = callback;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    
    await act(async () => {
        render(
            <TestApp>
                <AuthConsumer />
            </TestApp>
        );
    });
    
    expect(await screen.findByText('No user')).toBeInTheDocument();

    const mockUser = { id: '456', email: 'new@example.com' };
    const mockSession = { user: mockUser };
    supabase.rpc.mockResolvedValue({ data: { id: '456', email: 'new@example.com', team_memberships: [] } });
    
    await act(async () => {
        onAuthStateChangeCallback('SIGNED_IN', mockSession);
    });

    expect(await screen.findByText('User: new@example.com')).toBeInTheDocument();
  });
});