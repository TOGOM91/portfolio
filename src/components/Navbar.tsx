import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../logo1.png';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const changeLanguage = (lang: string) => {
    // Fonction tentant de changer la langue en accédant au select généré par Google Translate
    const tryChangeLanguage = () => {
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElem) {
        console.log('Select trouvé:', selectElem);
        selectElem.value = lang;
        const event = new Event('change', { bubbles: true });
        selectElem.dispatchEvent(event);
        console.log('Langue changée en:', lang);
        return true;
      }
      console.log('Select non trouvé, nouvelle tentative pour la langue:', lang);
      return false;
    };

    if (tryChangeLanguage()) return;

    console.log('Lancement du MutationObserver pour attendre le select pour la langue:', lang);
    const observer = new MutationObserver((mutations, obs) => {
      if (tryChangeLanguage()) {
        console.log('Langue changée via MutationObserver en:', lang);
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      console.warn('Observer déconnecté après délai sans trouver le select.');
    }, 10000);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/games', label: 'Games' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            src={logo}
            alt="Logo"
            className="h-12"
          />
        </NavLink>
        <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-4 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          {/* Boutons de changement de langue avec exclusion de traduction */}
          <button
            onClick={() => changeLanguage('fr')}
            translate="no"
            className="ml-4 px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
            aria-label="Switch to French"
          >
            FR
          </button>
          <button
            onClick={() => changeLanguage('en')}
            translate="no"
            className="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
            aria-label="Switch to English"
          >
            EN
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <div className="flex justify-end gap-4">
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            {/* Boutons mobiles avec exclusion de traduction */}
            <button
              onClick={() => changeLanguage('fr')}
              translate="no"
              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
              aria-label="Switch to French"
            >
              FR
            </button>
            <button
              onClick={() => changeLanguage('en')}
              translate="no"
              className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md transition-colors duration-300 ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
