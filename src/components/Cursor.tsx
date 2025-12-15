import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Références pour stocker la position cible et la position actuelle
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Met à jour la position cible
      targetPosition.current = { x: e.clientX, y: e.clientY };

      // Vérifie si l'élément ciblé utilise le curseur pointer
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
          target.tagName === 'A' ||
          target.tagName === 'BUTTON'
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const smoothAnimation = () => {
      // Interpolation entre la position actuelle et la position cible
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.1;
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.1;

      // Met à jour l'état avec la nouvelle position
      setPosition({ x: currentPosition.current.x, y: currentPosition.current.y });

      // Demande le prochain frame
      animationFrameId = requestAnimationFrame(smoothAnimation);
    };

    smoothAnimation();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-purple-500 z-50 pointer-events-none mix-blend-difference"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isPointer ? 1.5 : isClicking ? 0.8 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-purple-500 z-50 pointer-events-none mix-blend-difference"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 400,
          mass: 0.3,
        }}
      />
    </>
  );
};

export default Cursor;
