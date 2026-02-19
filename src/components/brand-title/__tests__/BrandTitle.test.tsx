import { render, screen } from '@testing-library/react';
import BrandTitle from '../BrandTitle';

describe('BrandTitle Component', () => {
  describe('Rendering', () => {
    it('should render with provided title', () => {
      render(<BrandTitle title="Sum" />);
      expect(screen.getByText('Sum')).toBeInTheDocument();
    });

    it('should render span element', () => {
      render(<BrandTitle title="Test" />);
      const element = screen.getByText('Test');
      expect(element.tagName).toBe('SPAN');
    });

    it('should apply default py-1 class', () => {
      render(<BrandTitle title="Title" />);
      const element = screen.getByText('Title');
      expect(element).toHaveClass('py-1');
    });

    it('should apply custom className', () => {
      render(<BrandTitle title="Title" className="text-primary text-2xl font-bold" />);
      const element = screen.getByText('Title');
      expect(element).toHaveClass('text-primary', 'text-2xl', 'font-bold', 'py-1');
    });

    it('should combine custom className with default py-1', () => {
      render(<BrandTitle title="Test" className="custom-class" />);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveClass('py-1');
    });

    it('should handle empty title', () => {
      const { container } = render(<BrandTitle title="" />);
      const element = container.querySelector('span');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('py-1');
    });

    it('should handle long title text', () => {
      const longTitle = 'This is a very long title that should still render correctly';
      render(<BrandTitle title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Tire Code & More!';
      render(<BrandTitle title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe('Props validation', () => {
    it('should only require title prop', () => {
      expect(() => {
        render(<BrandTitle title="Required" />);
      }).not.toThrow();
    });

    it('should maintain className prop as optional', () => {
      const { container } = render(<BrandTitle title="Title" />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('py-1');
    });
  });
});
