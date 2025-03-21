import React, { useState, useEffect } from 'react';
import styles from '../styles/Components.module.css';

interface ClientGlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
  glitchDuration?: number;
  onHover?: boolean;
}

const ClientGlitchText: React.FC<ClientGlitchTextProps> = ({
  text,
  className = '',
  glitchInterval = 4000,
  glitchDuration = 300,
  onHover = false
}) => {
  const [isClient, setIsClient] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || (onHover && !isHovering)) return;
    
    let glitchTimer: NodeJS.Timeout;
    let stopGlitchTimer: NodeJS.Timeout;

    const startGlitchCycle = () => {
      glitchTimer = setTimeout(() => {
        setGlitching(true);
        
        stopGlitchTimer = setTimeout(() => {
          setGlitching(false);
          startGlitchCycle();
        }, glitchDuration);
      }, glitchInterval);
    };

    startGlitchCycle();

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(stopGlitchTimer);
    };
  }, [isClient, glitchInterval, glitchDuration, onHover, isHovering]);

  const handleMouseEnter = () => {
    if (onHover) {
      setIsHovering(true);
      setGlitching(true);
      setTimeout(() => setGlitching(false), glitchDuration);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      setIsHovering(false);
    }
  };

  if (!isClient) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span 
      className={`${className} ${glitching ? styles.glitchEffect : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
};

export default ClientGlitchText; 