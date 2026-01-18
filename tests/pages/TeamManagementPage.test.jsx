import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils';
import TeamManagementPage from '@/pages/TeamManagementPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

// Mock dependencies
vi.mock('@/contexts/SupabaseAuthContext');
vi.mock('@/lib/customSupabaseClient');
vi.mock('@/components/ui/use-toast');

const mockUser = { id: 'user-123' };
const mockOrg = { id: 'org-123', name: 'Test Organization' };
const mockToast = vi.fn();

describe('TeamManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      activeOrganization: mockOrg,
      loading: false,
    });
    useToast.mockReturnValue({ toast: mockToast });

    // Default mock for rpc and from
    supabase.rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    supabase.from = vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
    }));
  });

  it('fetches and displays team members and pending invitations', async () => {
    // Setup specific mocks for this test
    supabase.rpc.mockResolvedValueOnce({
      data: [
        { team_member_id: 'tm-1', user_id: 'user-1', full_name: 'John Doe', email: 'john@test.com', role_name: 'Interviewer', avatar_url: null },
      ],
      error: null,
    });
    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'team_invitations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  { id: 'inv-1', email: 'jane@test.com', roles: { name: 'Coordinator' }, status: 'pending' },
                ],
                error: null,
              }),
            }),
          }),
        };
      }
      if (tableName === 'roles') {
        return {
          select: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Interviewer' }, { id: 2, name: 'Coordinator' }], error: null }),
        };
      }
      return { select: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    render(<TeamManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@test.com')).toBeInTheDocument();
      expect(screen.getByText('Pending Invitation')).toBeInTheDocument();
      expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    });
  });

  it('allows a user to send an invitation', async () => {
    supabase.from.mockImplementation((tableName) => {
        if (tableName === 'roles') {
            return { select: vi.fn().mockResolvedValue({ data: [{ id: 3, name: 'Interviewer' }], error: null }) };
        }
        return { select: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });
    supabase.rpc.mockResolvedValue({ data: { success: true }, error: null });

    render(<TeamManagementPage />);

    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@test.com' } });
    
    // Open select
    fireEvent.mouseDown(screen.getByRole('combobox'));
    await waitFor(() => {
        // Click option
        fireEvent.click(screen.getByText('Interviewer'));
    });

    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('invite_user_to_team', {
        organization_id_to_invite_to: mockOrg.id,
        invitee_email: 'new@test.com',
        role_id_to_assign: 3,
        site_url: window.location.origin,
      });
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Invitation Sent!',
      }));
    });
  });

  it('handles invitation failure', async () => {
    const errorMessage = 'User is already a member';
    supabase.rpc.mockResolvedValue({ data: { success: false, message: errorMessage }, error: null });
    supabase.from.mockImplementation((tableName) => {
        if (tableName === 'roles') {
            return { select: vi.fn().mockResolvedValue({ data: [{ id: 3, name: 'Interviewer' }], error: null }) };
        }
        return { select: vi.fn().mockResolvedValue({ data: [], error: null }) };
    });

    render(<TeamManagementPage />);

    fireEvent.click(screen.getByRole('button', { name: /invite user/i }));
    await waitFor(() => screen.getByLabelText('Email'));
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'existing@test.com' } });
    fireEvent.mouseDown(screen.getByRole('combobox'));
    await waitFor(() => fireEvent.click(screen.getByText('Interviewer')));
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Invitation Failed',
        description: errorMessage,
      });
    });
  });
});