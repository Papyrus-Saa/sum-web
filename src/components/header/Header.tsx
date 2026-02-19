import BrandTitle from "../brand-title/BrandTitle"
import { ThemeToggle } from "../theme/ThemeToggle"
import LanguageSwitcher from "../language-switcher/LanguageSwitcher"

const Header = () => {

  return (
    <div>
      <header className="flex justify-between items-center p-2 lg:p-6">
        <div>
          <BrandTitle title="Sum" className="md:text-2xl font-bold text-primary border-b border-secondary" />
          <BrandTitle title="Tirecode" className="md:text-2xl font-bold text-secondary border-t border-primary" />
        </div>
        <div className="flex items-center lg:gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
    </div>
  )
}

export default Header
