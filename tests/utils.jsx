
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n.js';

const AllTheProviders = ({ children }) => {
  return (
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
};

const customRender = (ui, options) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

// Export specific members to avoid 'render' conflict
export {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
  cleanup,
  renderHook
} from '@testing-library/react';

export { customRender as render };
