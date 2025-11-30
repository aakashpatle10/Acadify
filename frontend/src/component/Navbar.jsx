import React, { useState, useEffect } from 'react';

const Navbar = ({ toggleMobileMenu, portalType = 'Student', userName = 'User' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Get the main scroll container by ID
    const mainContainer = document.getElementById('main-scroll-container');

    if (!mainContainer) return;

    const handleScroll = () => {
      const currentScrollY = mainContainer.scrollTop;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at top - show navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    mainContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mainContainer.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`bg-white border-b border-gray-200 h-16 sticky top-0 z-30 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={toggleMobileMenu}
          >
            <span className="text-xl">☰</span>
          </button>

          <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
            <span className="text-xl">🎓</span>
            <span className="hidden sm:inline">{portalType}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <span className="text-xl">🔔</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Welcome,</p>
              <p className="text-xs text-gray-500">{userName}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600">
              👤
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
