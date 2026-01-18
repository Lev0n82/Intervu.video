import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils';
import InterviewSetupPage from '@/pages/InterviewSetupPage';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

vi.mock('@/contexts/SupabaseAuthContext');
vi.mock('@/lib/customSupabaseClient');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('Interview Template Creation (AC2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { id: 'user-1' },
      activeOrganization: { id: 'org-1' },
      loading: false,
    });

    supabase.from = vi.fn((table) => {
        if (table === 'personas') {
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                is: vi.fn().mockResolvedValue({ data: [{ id: 'p1', name: 'Interviewer' }], error: null })
            };
        }
        return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'template-1' }, error: null }),
            delete: vi.fn().mockResolvedValue({}),
        };
    });
  });

  it('creates an interview template with questions', async () => {
    render(<InterviewSetupPage />);

    // Wait for personas to load
    await waitFor(() => screen.getByLabelText(/template name/i));

    // Fill Title (AC2)
    fireEvent.change(screen.getByLabelText(/template name/i), { target: { value: 'Frontend Developer Interview' } });
    
    // Fill Question Text
    fireEvent.change(screen.getByLabelText(/question prompt/i), { target: { value: 'Explain React Hooks.' } });

    // Mock video upload requirement bypass for draft
    // In actual app, video might be required for active, but let's test Draft save which is looser
    const saveDraftBtn = screen.getByText(/save as draft/i);
    fireEvent.click(saveDraftBtn);

    await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('interview_templates');
        expect(supabase.from).toHaveBeenCalledWith('template_questions');
    });
  });
});