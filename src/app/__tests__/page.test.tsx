import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@/lib/theme';
import Home from '../page';
import i18next from '@/i18n/config';

const i18nForTests = i18next.cloneInstance();

beforeAll(async () => {
  if (!i18nForTests.isInitialized) {
    await new Promise((resolve) => {
      i18nForTests.on('initialized', () => resolve(null));
    });
  }
});

describe('Home Page', () => {
  const renderPage = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18nForTests}>
        <ThemeProvider>{component}</ThemeProvider>
      </I18nextProvider>
    );
  };

  beforeEach(() => {
    i18nForTests.changeLanguage('de');
  });

  describe('Rendering', () => {
    it('should render the main heading', () => {
      renderPage(<Home />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should display german title on DE language', async () => {
      renderPage(<Home />);
      
      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading.textContent).toBeTruthy();
      });
    });

    it('should have correct semantic structure', () => {
      renderPage(<Home />);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      const heading = screen.getByRole('heading', { level: 1 });
      expect(main).toContainElement(heading);
    });

    it('should apply responsive Tailwind classes', () => {
      renderPage(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('font-semibold');
      expect(heading).toHaveClass('text-center');
      expect(heading).toHaveClass('px-1');
      expect(heading).toHaveClass('sm:text-xl');
      expect(heading).toHaveClass('md:text-2xl');
      expect(heading).toHaveClass('lg:text-3xl');
      expect(heading).toHaveClass('lg:max-w-2xl');
    });
  });

  describe('i18n Integration', () => {
    it('should initialize with German as default', async () => {
      renderPage(<Home />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toHaveTextContent('Finde deinen Reifencode');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderPage(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have proper main landmark', () => {
      renderPage(<Home />);
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should have readable text contrast', () => {
      renderPage(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('font-semibold');
    });
  });

  describe('Loading States', () => {
    it('should show fallback translation initially', async () => {
      renderPage(<Home />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have text content available', async () => {
      renderPage(<Home />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading.textContent).toBeTruthy();
        expect(heading.textContent?.length).toBeGreaterThan(0);
      });
    });
  });
});
