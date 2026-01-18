import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils';
import DashboardPage from '@/pages/DashboardPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';

vi.mock('@/contexts/SupabaseAuthContext');

describe('DashboardPage', () => {
  it('shows loading state', () => {
    useAuth.mockReturnValue({
      userProfile: null,
      activeOrganization: null,
      loading: true,
    });
    render(<DashboardPage />);
    expect(screen.getByText(/loading your dashboard/i)).toBeInTheDocument();
  });

  it('shows "Create Organization" message when no organization is active', () => {
    useAuth.mockReturnValue({
      userProfile: { id: '1', full_name: 'Test User', team_memberships: [] },
      activeOrganization: null,
      loading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /no organization found/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create your first organization/i })).toBeInTheDocument();
  });

  it('renders the dashboard for an active organization', () => {
    useAuth.mockReturnValue({
      userProfile: { id: '1', full_name: 'Test User' },
      activeOrganization: { id: 'org1', name: 'Test Org' },
      loading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /welcome, test user/i })).toBeInTheDocument();
    expect(screen.getByText(/organization: test org/i)).toBeInTheDocument();
  });
});