import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePreloadedNavigationData } from "../contexts/DataContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get preloaded navigation data from context
  const { data: navigationData, error } = usePreloadedNavigationData();

  // Extract data with fallbacks
  const navItems = navigationData?.navItems || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  // No loading state needed since data is preloaded

  // Show error state or fallback
  if (error || !navigationData) {
    console.warn("Navigation data not available, using fallbacks");
  }

  return (
    <header
      className={`px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            {/* Mobile Logo - Mini version */}
            <img
              src="/assets/lombok-mini.png"
              alt="Lombok"
              className={`h-10 w-auto md:hidden transition-all duration-300 ${
                !isScrolled ? "filter invert brightness-0 contrast-100" : ""
              }`}
            />
            {/* Desktop Logo - Full row version */}
            <img
              src="/assets/lombok-full-row.png"
              alt="Lombok"
              className={`h-10 w-auto hidden md:block transition-all duration-300 ${
                !isScrolled ? "filter invert brightness-0 contrast-100" : ""
              }`}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`font-medium transition-colors hover:text-primary-600 cursor-pointer ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="btn-primary cursor-pointer"
            >
              Reservar Ahora
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-2">
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "#contact")}
                  className="btn-primary w-full text-center block cursor-pointer"
                >
                  Reservar Ahora
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
