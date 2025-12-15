import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import Confetti from 'react-confetti';

const SocialCard: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <ul>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="https://github.com/TOGOM91" target="_blank" rel="noopener noreferrer" aria-label="GitHub" onClick={(e) => e.stopPropagation()}>
              <Github className="svg" />
            </a>
            <div className="text">GitHub</div>
          </li>
          <li className="iso-pro">
            <span />
            <span />
            <span />
            <a href="https://www.linkedin.com/in/tom-farge-078b572a3/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" onClick={(e) => e.stopPropagation()}>
              <Linkedin className="svg" />
            </a>
            <div className="text">LinkedIn</div>
          </li>
        </ul>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    max-width: fit-content;
    border-radius: 15px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    gap: 1rem;
    backdrop-filter: blur(15px);
    box-shadow: inset 0 0 20px rgba(255,255,255,0.192),
      inset 0 0 5px rgba(255,255,255,0.274), 0 5px 5px rgba(0,0,0,0.164);
    transition: 0.5s;
  }

  .card:hover {
    animation: ease-out 5s;
    background: rgba(173,173,173,0.05);
  }

  .card ul {
    padding: 1rem;
    display: flex;
    list-style: none;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    position: relative;
  }

  .card ul li {
    cursor: pointer;
    position: relative;
  }

  .svg {
    transition: all 0.3s;
    padding: 1rem;
    height: 60px;
    width: 60px;
    border-radius: 100%;
    color: rgb(192,132,252);
    fill: currentColor;
    box-shadow: inset 0 0 20px rgba(255,255,255,0.3),
      inset 0 0 5px rgba(255,255,255,0.5), 0 5px 5px rgba(0,0,0,0.164);
  }

  .text {
    opacity: 0;
    border-radius: 5px;
    padding: 5px;
    transition: all 0.3s;
    color: rgb(192,132,252);
    background-color: rgba(255,255,255,0.3);
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    box-shadow: -5px 0 1px rgba(153,153,153,0.2),
      -10px 0 1px rgba(153,153,153,0.2),
      inset 0 0 20px rgba(255,255,255,0.3),
      inset 0 0 5px rgba(255,255,255,0.5), 0 5px 5px rgba(0,0,0,0.082);
  }

  .iso-pro {
    transition: 0.5s;
  }

  .iso-pro:hover a > .svg {
    transform: translate(15px, -15px);
  }

  .iso-pro:hover .text {
    opacity: 1;
    transform: translate(25px, -2px) skew(-5deg);
  }

  .iso-pro:hover .svg {
    transform: translate(5px, -5px);
  }

  .iso-pro span {
    opacity: 0;
    position: absolute;
    color: #1877f2;
    border-color: #1877f2;
    box-shadow: inset 0 0 20px rgba(255,255,255,0.3),
      inset 0 0 5px rgba(255,255,255,0.5), 0 5px 5px rgba(0,0,0,0.164);
    border-radius: 50%;
    transition: all 0.3s;
    height: 60px;
    width: 60px;
  }

  .iso-pro:hover span {
    opacity: 1;
  }

  .iso-pro:hover span:nth-child(1) {
    opacity: 0.2;
  }

  .iso-pro:hover span:nth-child(2) {
    opacity: 0.4;
    transform: translate(5px, -5px);
  }

  .iso-pro:hover span:nth-child(3) {
    opacity: 0.6;
    transform: translate(10px, -10px);
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [secretActivated, setSecretActivated] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const [confettiDimensions, setConfettiDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (footerRef.current) {
        const { width, height } = footerRef.current.getBoundingClientRect();
        setConfettiDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleFooterClick = () => {
    setSecretActivated((prev) => !prev);
  };

  return (
    <footer
      ref={footerRef}
      className={`relative overflow-hidden py-10 mt-20 transition-colors duration-500 ${secretActivated ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-100 dark:bg-gray-800'}`}
      onClick={handleFooterClick}
    >
      {secretActivated && (
        <div className="absolute inset-0 pointer-events-none">
          <Confetti
            width={confettiDimensions.width}
            height={confettiDimensions.height}
            numberOfPieces={300}
            recycle={false}
          />
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">DevPortfolio</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Showcasing my skills and projects in web development with a focus on interactive and immersive experiences.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <SocialCard />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            © {currentYear} Tom Portfolio. Fait avec <Heart size={16} className="mx-1 text-red-500" /> et React.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            {secretActivated ? "Click again to hide the secret!" : "Click anywhere here to unlock a secret!"}
          </p>
          {secretActivated && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 20, -20, 0] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-white font-extrabold text-2xl mt-4"
            >
              Secret Mode Activated! 🚀✨ Enjoy the Confetti!
            </motion.div>
          )}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
