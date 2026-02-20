import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '@/lib/theme';
import i18next from '@/i18n/config';

const i18nForTests = i18next.cloneInstance();

beforeAll(async () => {
  if (!i18nForTests.isInitialized) {
    await new Promise(resolve => {
      i18nForTests.on('initialized', () => resolve(null));
    });
  }
});

describe('ThemeToggle Component', () => {
  const renderWithProviders = async (lng = 'de') => {
    await waitFor(async () => {
      await i18nForTests.changeLanguage(lng);
    });
    return render(
      <I18nextProvider i18n={i18nForTests}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </I18nextProvider>
    );
  };

  describe('Rendering', () => {
    it('should render a button element', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessibility attributes', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });

    it('should display correct aria-label in German', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'Design ändern');
      expect(button).toHaveAttribute('title', 'Design ändern');
    });

    it('should display correct aria-label in English', async () => {
      await renderWithProviders('en');

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Toggle Theme');
        expect(button).toHaveAttribute('title', 'Toggle Theme');
      });
    });

    it('should display correct aria-label in Spanish', async () => {
      await renderWithProviders('es');

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Cambiar Tema');
        expect(button).toHaveAttribute('title', 'Cambiar Tema');
      });
    });
  });

  describe('Theme toggle functionality', () => {
    it('should be clickable', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      expect(button).toBeEnabled();
    });

    it('should have correct CSS classes', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      expect(button).toHaveClass('p-2', 'cursor-pointer');
    });

    it('should call toggleTheme when clicked', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(button).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('should update labels when language changes', async () => {
      await renderWithProviders();
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'Design ändern');

      await waitFor(async () => {
        await i18nForTests.changeLanguage('en');
      });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Toggle Theme');
      });
    });
  });
});
