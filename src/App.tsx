import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Games from './pages/Games';
import About from './pages/About';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { ThemeProvider } from './context/ThemeContext';
import Cursor from './components/Cursor';
import Contact from './pages/Contact';

function App() {
  const [loading, setLoading] = useState(true);

  // Supprime l'attribut "translate" dès le montage
  useEffect(() => {
    document.documentElement.removeAttribute('translate');
  }, []);

  // Observer pour supprimer "translate" s'il est réinjecté
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'translate') {
          document.documentElement.removeAttribute('translate');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Simule un temps de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="relative">
          <Cursor />
          {loading ? (
            <Loader />
          ) : (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/portfolio" element={<Home />} />
                  <Route path="/portfolio/projects" element={<Projects />} />
                  <Route path="/portfolio/skills" element={<Skills />} />
                  <Route path="/portfolio/games" element={<Games />} />
                  <Route path="/portfolio/about" element={<About />} />
                  <Route path="/portfolio/contact" element={<Contact />} />
                </Routes>
              </AnimatePresence>
              <Footer />
            </div>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
