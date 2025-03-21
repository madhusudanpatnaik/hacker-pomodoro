import { useEffect, useRef } from 'react';
import styles from '@/styles/Components.module.css';

const ClientMatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters to use (more subtle now, mostly dots and simple characters)
    const chars = '.·:;•○□+=-';
    
    const columns = Math.floor(canvas.width / 15); // Reduce density
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start above screen at random positions
    }
    
    const draw = () => {
      // Semi-transparent background to create trail effect (more transparent now)
      ctx.fillStyle = 'rgba(26, 27, 38, 0.04)'; // Use background color with low opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text color to a subtle blue-gray
      ctx.fillStyle = 'rgba(94, 156, 160, 0.2)'; // Muted teal color with low opacity
      ctx.font = '14px monospace';
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw the character
        ctx.fillText(text, i * 15, Math.floor(drops[i]));
        
        // Move drop down
        drops[i] += 0.5; // Slow down the movement
        
        // Reset drop to top with random delay when it passes the bottom
        if (drops[i] > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
      }
    };
    
    // Set interval for animation (slower now for less distraction)
    const interval = setInterval(draw, 100);
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className={styles.matrixRain} />;
};

export default ClientMatrixRain; 