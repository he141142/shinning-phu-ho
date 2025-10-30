'use client'

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeDebug() {
  const { theme } = useTheme();
  const [hasDarkClass, setHasDarkClass] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkDarkClass = () => {
      setHasDarkClass(document.documentElement.classList.contains('dark'));
    };

    checkDarkClass();

    // Check every 100ms
    const interval = setInterval(checkDarkClass, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-black/90 transition-colors"
        aria-label={isOpen ? 'Close theme debug' : 'Open theme debug'}
      >
        {isOpen ? '✕ Close Debug' : '🎨 Theme Debug'}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-black/80 text-white p-4 rounded-lg text-xs font-mono min-w-[300px]">
          <div>Theme State: <span className="text-yellow-300">{theme}</span></div>
          <div>Dark Class: <span className={hasDarkClass ? 'text-red-400' : 'text-green-400'}>
            {hasDarkClass ? 'YES (should be NO for light)' : 'NO (correct for light)'}
          </span></div>
          <div>LocalStorage: <span className="text-blue-300">{typeof window !== 'undefined' && localStorage.getItem('theme')}</span></div>
          <div className="mt-2 p-2 bg-white text-black">Light mode box</div>
          <div className="mt-2 p-2 bg-gray-900 text-white">Dark mode box</div>
        </div>
      )}
    </div>
  );
}
