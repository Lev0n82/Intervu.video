import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils';
import SurveyBuilderPage from '@/pages/SurveyBuilderPage';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Mock dependencies
vi.mock('@/contexts/SupabaseAuthContext');
vi.mock('@/lib/customSupabaseClient');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockUser = { id: 'user-1' };
const mockOrg = { id: 'org-1' };

describe('Survey Lifecycle Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      activeOrganization: mockOrg,
      loading: false,
    });
    
    // Mock Supabase inserts
    supabase.from = vi.fn((table) => {
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
        upsert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockResolvedValue({ error: null }),
      };
      
      if (table === 'surveys') {
        mockChain.single.mockResolvedValue({ data: { id: 'new-survey-id' }, error: null });
      }
      if (table === 'survey_questions') {
        mockChain.insert.mockResolvedValue({ error: null });
      }
      return mockChain;
    });
  });

  it('allows user to create and save a survey', async () => {
    render(<SurveyBuilderPage />);

    // 1. Fill basic info
    fireEvent.change(screen.getByLabelText(/survey title/i), { target: { value: 'Integration Test Survey' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Testing flow' } });

    // 2. Add a question text
    const qText = screen.getByLabelText(/question text/i);
    fireEvent.change(qText, { target: { value: 'How was the integration test?' } });

    // 3. Save as Draft
    const saveBtn = screen.getByText(/save as draft/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      // Check if surveys table was called
      expect(supabase.from).toHaveBeenCalledWith('surveys');
      // Check if questions were inserted
      expect(supabase.from).toHaveBeenCalledWith('survey_questions');
    });
  });

  it('validates required fields before saving', async () => {
    render(<SurveyBuilderPage />);
    
    // Attempt save without title
    const saveBtn = screen.getByText(/save as draft/i);
    fireEvent.click(saveBtn);

    // Expect validation toast (mocked implicitly by not calling DB)
    expect(supabase.from).not.toHaveBeenCalled();
  });
});