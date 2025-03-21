import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import ClientGlitchText from './ClientGlitchText';
import ThemeSwitcher from './ThemeSwitcher';
import AnimationToggle from './AnimationToggle';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ isOpen, onClose }) => {
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeItem, setActiveItem] = useState('about');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsMounted(true), 50);
    } else {
      document.body.style.overflow = '';
      setIsMounted(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isClient) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const menuItems = [
    { id: 'about', label: 'About', content: (
      <div className={styles.menuSection}>
        <h2>About Hacker Pomodoro</h2>
        <p>Hacker Pomodoro is a productivity tool designed for developers, engineers, and tech enthusiasts. 
        It implements the Pomodoro Technique with a hacker aesthetic, helping you maintain focus and track your productivity.</p>
        <p>The Pomodoro Technique is a time management method that uses timed intervals (traditionally 25 minutes) of focused work followed by short breaks.</p>
      </div>
    )},
    { id: 'settings', label: 'Settings', content: (
      <div className={styles.menuSection}>
        <h2>Settings</h2>
        <div className={styles.settingsGrid}>
          <div className={styles.settingItem}>
            <h3>Theme</h3>
            <ThemeSwitcher />
          </div>
          <div className={styles.settingItem}>
            <h3>Animation Style</h3>
            <AnimationToggle />
          </div>
        </div>
      </div>
    )},
    { id: 'shortcuts', label: 'Shortcuts', content: (
      <div className={styles.menuSection}>
        <h2>Keyboard Shortcuts</h2>
        <div className={styles.shortcutGrid}>
          <div className={styles.shortcut}>
            <kbd>Space</kbd>
            <span>Start/Pause Timer</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>R</kbd>
            <span>Reset Timer</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>M</kbd>
            <span>Toggle Menu</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>T</kbd>
            <span>Cycle Through Themes</span>
          </div>
        </div>
      </div>
    )},
  ];

  return (
    <div className={`${styles.fullscreenMenu} ${isMounted ? styles.menuOpen : ''}`}>
      <div className={styles.menuOverlay} onClick={onClose}></div>
      <div className={styles.menuContent}>
        <button className={styles.menuCloseBtn} onClick={onClose}>
          <span>&times;</span>
        </button>
        
        <div className={styles.menuHeader}>
          <ClientGlitchText 
            text="HACKER POMODORO" 
            className={styles.menuTitle} 
            glitchInterval={3000}
            onHover={true}
          />
        </div>
        
        <div className={styles.menuLayout}>
          <nav className={styles.menuNav}>
            <ul>
              {menuItems.map(item => (
                <li key={item.id}>
                  <button 
                    className={`${styles.menuNavItem} ${activeItem === item.id ? styles.activeMenuItem : ''}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className={styles.menuContentContainer}>
            {menuItems.find(item => item.id === activeItem)?.content}
          </div>
        </div>
        
        <div className={styles.menuFooter}>
          <p>Made with <span className={styles.heartBeat}>❤️</span> for developer productivity</p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenMenu; 