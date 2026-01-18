import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils';
import InterviewStartPage from '@/pages/InterviewStartPage';
import { supabase } from '@/lib/customSupabaseClient';
import { useParams, useNavigate } from 'react-router-dom';

vi.mock('@/lib/customSupabaseClient');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: vi.fn(),
        useNavigate: vi.fn(),
    };
});

describe('Candidate Video Submission (AC3)', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useParams.mockReturnValue({ submissionToken: 'valid-token' });
        useNavigate.mockReturnValue(mockNavigate);

        supabase.from = vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
                data: {
                    id: 'sub-1',
                    status: 'invited',
                    interviews: {
                        title: 'Job Role',
                        interview_templates: { questions: [] }
                    }
                },
                error: null
            }),
            update: vi.fn().mockReturnThis(),
        }));
    });

    it('loads interview start page and checks consent', async () => {
        render(<InterviewStartPage />);

        await waitFor(() => {
            expect(screen.getByText("You're Invited to an Interview")).toBeInTheDocument();
        });

        const consentCheckbox = screen.getByRole('checkbox');
        const startButton = screen.getByText("Let's Begin");

        // Verify button disabled initially
        expect(startButton).toBeDisabled();

        // Check consent
        fireEvent.click(consentCheckbox);
        expect(startButton).toBeEnabled();

        // Start
        fireEvent.click(startButton);

        await waitFor(() => {
            // Should update submission status to consented
            expect(supabase.from).toHaveBeenCalledWith('interview_submissions');
            expect(mockNavigate).toHaveBeenCalledWith('/interview/check-device/sub-1');
        });
    });
});