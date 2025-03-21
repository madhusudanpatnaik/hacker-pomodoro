import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

const CodeRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme, themeColors } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    const resize = () => {
      console.log('Resizing code rain canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Configuration
    const fontSize = 16; // Increased from 14
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops: number[] = [];
    // Mix of Matrix-style characters and programming symbols
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]()<>/\\|=+-*&^%$#@!';
    const speedFactor = 1.5; // Increased from 1.2
    
    // Set initial drop positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
    }
    
    // Set canvas styles
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textAlign = 'center';
    
    // Animation loop
    const draw = () => {
      // Semi-transparent background to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, 0.05)`; // Made more transparent for longer trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const primaryColor = themeColors.primary || '#00ff00';
      const secondaryColor = themeColors.secondary || '#88ff88';
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Set color based on position (head of drop is brighter)
        const y = drops[i] * fontSize;
        if (y > 0) {
          if (drops[i] === 1) {
            // Head of the drop - brightest
            ctx.fillStyle = '#ffffff'; // Ultra bright white head
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 10;
          } else if (drops[i] < 5) {
            // Near the head - bright
            ctx.fillStyle = primaryColor;
            ctx.shadowColor = primaryColor;
            ctx.shadowBlur = 5;
          } else {
            // Create a gradient effect down the chain
            const opacity = Math.max(0.6, 1 - (drops[i] / 30)); // Increased minimum opacity
            const [r, g, b] = hexToRgb(secondaryColor);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.shadowBlur = 0;
          }
          
          // Draw character
          ctx.fillText(char, i * fontSize, y);
        }
        
        // Move drop position and reset if needed
        if (y > canvas.height || Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Increment position at varying speeds
        drops[i] += Math.random() * speedFactor;
      }
      
      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Helper function to convert hex to rgb
    function hexToRgb(hex: string): [number, number, number] {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 255, 0];
    }
    
    console.log('Starting code rain animation');
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      console.log('Cleaning up code rain animation');
    };
  }, [currentTheme, themeColors]);
  
  return <canvas ref={canvasRef} className={styles.codeRain} />;
};

export default CodeRain; 