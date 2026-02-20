import BrandTitle from '../brand-title/BrandTitle';
import { ThemeToggle } from '../theme/ThemeToggle';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-2 lg:p-6 mb-12 border-b-2 border-border-l dark:border-border-d">
      <div className="">
        <BrandTitle
          title="Sum"
          className="md:text-2xl font-bold text-primary border-b border-secondary"
        />
        <BrandTitle
          title="Tirecode"
          className="md:text-2xl font-bold text-secondary border-t border-primary"
        />
      </div>
      <div className="flex items-center lg:gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
