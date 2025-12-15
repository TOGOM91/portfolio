import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [loading, setLoading] = useState(true);

  // Supprime l'attribut "translate" dès le montage
  useEffect(() => {
    document.documentElement.removeAttribute("translate");
  }, []);

  // Empêche Google Translate de le réinjecter
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "translate"
        ) {
          document.documentElement.removeAttribute("translate");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {/* 🔑 IMPORTANT : basename */}
      <BrowserRouter basename="/portfolio">
        <div className="relative">
          <Cursor />

          {loading ? (
            <Loader />
          ) : (
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Navbar />

              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </AnimatePresence>

              <Footer />
            </div>
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
