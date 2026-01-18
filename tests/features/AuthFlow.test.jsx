import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils';
import App from '@/App';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Mock the auth context to control its behavior
const mockSignUp = vi.fn();
const mockSignIn = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockToast = vi.fn();

vi.mock('@/contexts/SupabaseAuthContext', async () => {
  const actual = await vi.importActual('@/contexts/SupabaseAuthContext');
  return {
    ...actual,
    useAuth: () => ({
      signUp: mockSignUp,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      user: null, // Assume no user is logged in initially
      loading: false,
    }),
  };
});

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));


describe('Authentication Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('allows a user to fill out the sign-up form and see the verification message', async () => {
    mockSignUp.mockResolvedValue({ user: { id: '123' }, error: null });
    
    render(<App />);

    // Navigate to Auth page if not already there (MemoryRouter starts at '/')
    // In our app, '/' redirects to '/landing' then to '/auth' if not logged in.
    // Let's directly go to /auth for simplicity in this test.
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/sign up email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/sign up password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/by signing up, you agree/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      // Check if the success message is displayed
      expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
      expect(screen.getByText(/please check your email inbox/i)).toBeInTheDocument();
    });

    // Verify that the signUp function was called with the correct details
    expect(mockSignUp).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      null,
      { full_name: 'Test User' }
    );
  });

  it('handles verification link correctly by showing a toast and navigating to login', async () => {
    // Manually set the starting route to include the verification hash
    window.history.pushState({}, 'Test page', '/#access_token=test-token&type=signup');
    
    render(<App />);

    await waitFor(() => {
      // Check for the success toast
      expect(mockToast).toHaveBeenCalledWith({
        title: "✅ Verification Successful!",
        description: "Your email has been verified. Please log in to continue.",
      });

      // Check if the app navigated to the login page
      expect(screen.getByLabelText(/login email/i)).toBeInTheDocument();
      
      // Check if the URL hash was cleared
      expect(window.location.hash).toBe('');
    });
  });
});