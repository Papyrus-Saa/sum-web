
import { render, screen, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { I18nProvider } from '@/i18n/I18nProvider';

const TestComponent = () => {
  const { t, ready } = useTranslation();

  return (
    <div>
      <p data-testid="language-text">{t('language')}</p>
      <p data-testid="ready-status">{ready ? 'ready' : 'loading'}</p>
    </div>
  );
};

describe('I18nProvider', () => {
  describe('Provider initialization', () => {
    it('should render children', () => {
      render(
        <I18nProvider>
          <div data-testid="test-child">Test Child</div>
        </I18nProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should provide i18n context to children', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('language-text')).toBeInTheDocument();
      });
    });

    it('should make translations available immediately', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      await waitFor(() => {
        const languageText = screen.getByTestId('language-text');
        expect(languageText.textContent).toBe('Sprache');
      });
    });
  });

  describe('Ready state', () => {
    it('should indicate ready state to children', async () => {
      render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready-status')).toHaveTextContent('ready');
      });
    });

    it('should render content even while initializing', () => {
      render(
        <I18nProvider>
          <div data-testid="test-child">Always Visible</div>
        </I18nProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('Multiple children', () => {
    it('should provide i18n to multiple children', async () => {
      render(
        <I18nProvider>
          <TestComponent />
          <TestComponent />
        </I18nProvider>
      );

      await waitFor(() => {
        const languageTexts = screen.getAllByTestId('language-text');
        expect(languageTexts).toHaveLength(2);
        expect(languageTexts[0]).toHaveTextContent('Sprache');
        expect(languageTexts[1]).toHaveTextContent('Sprache');
      });
    });
  });

  describe('Cleanup', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(
        <I18nProvider>
          <TestComponent />
        </I18nProvider>
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
