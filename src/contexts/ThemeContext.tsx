import React, { createContext, useState, useContext, useEffect } from 'react';

// Define theme types
export type ThemeType = 'cyberdark' | 'cyberlight' | 'matrix' | 'midnight' | 'ocean';

// Define theme properties
interface ThemeColors {
  primary: string;
  primaryMuted: string;
  secondary: string;
  secondaryMuted: string;
  background: string;
  surface: string;
  surfaceAccent: string;
  text: string;
  textSecondary: string;
  primaryRgb: string;
  secondaryRgb: string;
}

// Helper function to extract RGB values from hex
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// Theme definitions
export const themes: Record<ThemeType, ThemeColors> = {
  cyberdark: {
    primary: '#4a6fa5',
    primaryMuted: '#3b5683',
    secondary: '#5e9ca0',
    secondaryMuted: '#4a7d80',
    background: '#1a1b26',
    surface: '#24283b',
    surfaceAccent: '#2e3346',
    text: '#d8dee9',
    textSecondary: 'rgba(216, 222, 233, 0.65)',
    primaryRgb: '74, 111, 165',
    secondaryRgb: '94, 156, 160'
  },
  cyberlight: {
    primary: '#3b82f6',
    primaryMuted: '#2563eb',
    secondary: '#10b981',
    secondaryMuted: '#059669',
    background: '#f8fafc',
    surface: '#f1f5f9',
    surfaceAccent: '#e2e8f0',
    text: '#1e293b',
    textSecondary: 'rgba(30, 41, 59, 0.7)',
    primaryRgb: '59, 130, 246',
    secondaryRgb: '16, 185, 129'
  },
  matrix: {
    primary: '#00ff41',
    primaryMuted: '#008f11',
    secondary: '#39ff14',
    secondaryMuted: '#0d7377',
    background: '#0d0208',
    surface: '#1a1a1a',
    surfaceAccent: '#222222',
    text: '#00ff41',
    textSecondary: 'rgba(0, 255, 65, 0.7)',
    primaryRgb: '0, 255, 65',
    secondaryRgb: '57, 255, 20'
  },
  midnight: {
    primary: '#bd93f9',
    primaryMuted: '#6272a4',
    secondary: '#ff79c6',
    secondaryMuted: '#ff5555',
    background: '#282a36',
    surface: '#44475a',
    surfaceAccent: '#373951',
    text: '#f8f8f2',
    textSecondary: 'rgba(248, 248, 242, 0.7)',
    primaryRgb: '189, 147, 249',
    secondaryRgb: '255, 121, 198'
  },
  ocean: {
    primary: '#8be9fd',
    primaryMuted: '#56b6c2',
    secondary: '#ff79c6',
    secondaryMuted: '#c678dd',
    background: '#0f111a',
    surface: '#1c1f2b',
    surfaceAccent: '#252a3a',
    text: '#abb2bf',
    textSecondary: 'rgba(171, 178, 191, 0.7)',
    primaryRgb: '139, 233, 253',
    secondaryRgb: '255, 121, 198'
  }
};

// Theme context type
interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColors: ThemeColors;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('cyberdark');

  // Load saved theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('pomodoroTheme') as ThemeType;
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
      // Continue with default theme
    }
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    try {
      const root = document.documentElement;
      const colors = themes[currentTheme];
      
      // Set CSS variables
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-muted', colors.primaryMuted);
      root.style.setProperty('--secondary', colors.secondary);
      root.style.setProperty('--secondary-muted', colors.secondaryMuted);
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--surface', colors.surface);
      root.style.setProperty('--surface-accent', colors.surfaceAccent);
      root.style.setProperty('--text', colors.text);
      root.style.setProperty('--text-secondary', colors.textSecondary);
      
      // Set RGB variables for opacity/gradient use
      root.style.setProperty('--primary-rgb', colors.primaryRgb);
      root.style.setProperty('--secondary-rgb', colors.secondaryRgb);
      
      // Save to localStorage
      localStorage.setItem('pomodoroTheme', currentTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
      // Theme will be visible but not saved
    }
  }, [currentTheme]);

  // Set theme function
  const setTheme = (theme: ThemeType) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
    } else {
      console.error(`Invalid theme: ${theme}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      themeColors: themes[currentTheme] 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 