import { useEffect, useState } from 'react';

export const useCornerHover = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [showSudo, setShowSudo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // Check if mouse is in top-right corner (within 50px of corner)
      const isInCorner = clientX >= innerWidth - 50 && clientY <= 50;
      
      if (isInCorner && !isHovering) {
        setIsHovering(true);
        // Show sudo button after a brief delay
        setTimeout(() => setShowSudo(true), 500);
      } else if (!isInCorner && isHovering) {
        setIsHovering(false);
        // Hide sudo button after leaving corner
        setTimeout(() => setShowSudo(false), 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  const hideSudo = () => {
    setShowSudo(false);
    setIsHovering(false);
  };

  return { showSudo, hideSudo };
};