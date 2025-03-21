import { useState, useEffect } from 'react';
import styles from '../styles/Components.module.css';

interface GlitchTextProps {
  text: string;
  speed?: number;
  glitchFactor?: number;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  speed = 50, 
  glitchFactor = 0.3,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    // Reset state when text changes
    setDisplayText('');
    setCharIndex(0);
    setIsTyping(true);
  }, [text]);
  
  useEffect(() => {
    if (!isTyping) return;
    
    const shouldGlitch = Math.random() < glitchFactor;
    
    if (charIndex >= text.length) {
      setIsTyping(false);
      return;
    }
    
    const timeout = setTimeout(() => {
      // Add next character
      setDisplayText(prev => prev + text[charIndex]);
      setCharIndex(prev => prev + 1);
      
      // Random chance to glitch - add a random character and remove it quickly
      if (shouldGlitch && charIndex > 0) {
        const glitchChars = '!@#$%^&*()_+=-[]\\;\',./{}|:"<>?';
        const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        
        setDisplayText(prev => prev + randomChar);
        
        setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, speed / 2);
      }
    }, shouldGlitch ? speed * 1.5 : speed);
    
    return () => clearTimeout(timeout);
  }, [text, charIndex, isTyping, speed, glitchFactor]);
  
  return (
    <span 
      className={`${styles.glitchText} ${className}`}
      data-text={displayText}
    >
      {displayText}
      {isTyping && <span className={styles.cursor}>_</span>}
    </span>
  );
};

export default GlitchText; 