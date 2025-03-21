import React, { useState } from 'react';
import { useTheme, ThemeType, themes } from '../contexts/ThemeContext';
import styles from '../styles/Components.module.css';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
    setIsOpen(false);
  };

  // Theme icon mapping
  const themeIcons: Record<ThemeType, string> = {
    cyberdark: '🌃',
    cyberlight: '☀️',
    matrix: '👨‍💻',
    midnight: '🌙',
    ocean: '🌊'
  };
  
  // Theme names for display
  const themeNames: Record<ThemeType, string> = {
    cyberdark: 'Cyber Dark',
    cyberlight: 'Cyber Light',
    matrix: 'Matrix',
    midnight: 'Midnight',
    ocean: 'Ocean'
  };

  return (
    <div className={styles.themeSwitcher}>
      <button 
        className={styles.themeButton}
        onClick={toggleDropdown}
        aria-label="Theme switcher"
      >
        <span className={styles.themeIcon}>{themeIcons[currentTheme]}</span>
        <span className={styles.themeName}>{themeNames[currentTheme]}</span>
      </button>

      {isOpen && (
        <div className={styles.themeDropdown}>
          {Object.keys(themes).map((theme) => (
            <button
              key={theme}
              className={`${styles.themeOption} ${currentTheme === theme ? styles.activeTheme : ''}`}
              onClick={() => handleThemeChange(theme as ThemeType)}
            >
              <span className={styles.themeIcon}>{themeIcons[theme as ThemeType]}</span>
              <span>{themeNames[theme as ThemeType]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 