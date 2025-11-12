import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; 

const ToggleDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    // setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${
        isDarkMode ? 'bg-gray-800 text-yellow-100' : 'bg-gray-200 text-gray-800'
      }`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" /> 
      )}
    </button>
  );
};

export default ToggleDarkMode;
