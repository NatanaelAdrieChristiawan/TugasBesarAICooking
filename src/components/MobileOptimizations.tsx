import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}

export function useViewportHeight() {
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      // Use visual viewport height on mobile to account for browser UI
      const vh = window.visualViewport?.height || window.innerHeight;
      setHeight(`${vh}px`);
    };

    updateHeight();
    
    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);

  return height;
}