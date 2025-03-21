import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useTheme } from '../contexts/ThemeContext';

type ParticleType = {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  shape: 'circle' | 'square' | 'triangle' | 'line';
};

const ParallaxBackground: React.FC = () => {
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { currentTheme } = useTheme();
  
  // Create particles on mount
  useEffect(() => {
    const newParticles: ParticleType[] = [];
    const numParticles = window.innerWidth < 768 ? 15 : 25;
    
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        shape: ['circle', 'square', 'triangle', 'line'][Math.floor(Math.random() * 4)] as any
      });
    }
    
    setParticles(newParticles);
    
    const handleResize = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: Math.min(particle.x, window.innerWidth),
          y: Math.min(particle.y, window.innerHeight)
        }))
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let x = particle.x + particle.speedX;
          let y = particle.y + particle.speedY;
          
          // Boundary check and wrap around
          if (x < 0) x = window.innerWidth;
          if (x > window.innerWidth) x = 0;
          if (y < 0) y = window.innerHeight;
          if (y > window.innerHeight) y = 0;
          
          return {
            ...particle,
            x,
            y
          };
        })
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const renderParticle = (particle: ParticleType) => {
    // Calculate distance from mouse for parallax effect
    const dx = particle.x - mousePosition.x;
    const dy = particle.y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
    const parallaxFactor = 1 - Math.min(distance / maxDistance, 1) * 0.3;
    
    // Apply parallax effect to position
    const offsetX = dx * 0.01 * parallaxFactor;
    const offsetY = dy * 0.01 * parallaxFactor;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${particle.x - offsetX}px`,
      top: `${particle.y - offsetY}px`,
      opacity: particle.opacity * parallaxFactor,
      width: `${particle.size}px`,
      height: particle.shape === 'line' ? `${particle.size * 5}px` : `${particle.size}px`,
      backgroundColor: 'var(--primary-muted)',
      borderRadius: particle.shape === 'circle' ? '50%' : 
                   particle.shape === 'square' ? '0' : '0',
      transform: particle.shape === 'triangle' 
                 ? 'rotate(45deg)' 
                 : particle.shape === 'line' 
                   ? 'rotate(90deg)' 
                   : 'none',
      transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
    };
    
    return <div key={particle.id} style={style} />;
  };
  
  return (
    <div className={styles.backgroundParallax}>
      <div className={styles.backgroundGradient}></div>
      {particles.map(renderParticle)}
    </div>
  );
};

export default ParallaxBackground; 