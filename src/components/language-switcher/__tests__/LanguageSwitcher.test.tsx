import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import i18next from '@/i18n/config';

// Create a fresh i18next instance for tests
const i18nForTests = i18next.cloneInstance();


beforeAll(async () => {
  if (!i18nForTests.isInitialized) {
    await new Promise((resolve) => {
      i18nForTests.on('initialized', () => resolve(null));
    });
  }
});

describe('LanguageSwitcher Component', () => {
  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18nForTests}>{component}</I18nextProvider>
    );
  };

  beforeEach(() => {
    i18nForTests.changeLanguage('de');
  });

  describe('Rendering', () => {
    it('should render the language switcher button', () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });
      expect(button).toBeInTheDocument();
    });

    it('should display the icon', () => {
      renderWithI18n(<LanguageSwitcher />);
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });

    it('should have correct accessibility attributes', () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByTestId('language-switcher');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
      expect(button).toHaveAttribute('role', 'button');
    });
  });

  describe('Language selection menu', () => {
    it('should not show language options initially', () => {
      renderWithI18n(<LanguageSwitcher />);
      expect(screen.queryByText('EN')).not.toBeInTheDocument();
    });

    it('should show language options when button is clicked', async () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('DE')).toBeInTheDocument();
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.getByText('ES')).toBeInTheDocument();
      });
    });

    it('should hide menu after language selection', async () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('EN')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('EN'));

      await waitFor(() => {
        expect(screen.queryByText('DE')).not.toBeInTheDocument();
      });
    });
  });

  describe('Language switching', () => {
    it('should change language when option is clicked', async () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('EN')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('EN'));

      await waitFor(() => {
        expect(i18nForTests.language).toBe('en');
      });
    });

    it('should update button label after language change', async () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });

      fireEvent.click(button);

      await waitFor(() => {
        fireEvent.click(screen.getByText('ES'));
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /idioma/i })).toBeInTheDocument();
      });
    });
  });

  describe('Button toggle', () => {
    it('should toggle menu open/closed on button click', async () => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /sprache/i });

      // Open menu
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('EN')).toBeInTheDocument();
      });

      // Close menu
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByText('EN')).not.toBeInTheDocument();
      });
    });
  });
});
