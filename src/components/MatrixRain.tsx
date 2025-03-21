import { useEffect, useRef } from 'react';
import styles from '../styles/Components.module.css';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to display
    const chars = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ1234567890qwertyuiopasdfghjklzxcvbnm<>?/\\|[]{}!@#$%^&*()_+-=';
    const charArray = chars.split('');
    
    // Columns for rain
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to store current y position of each drop
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Random initial height
    }

    // Draw the matrix rain
    const draw = () => {
      // Black semi-transparent background to show trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Softer green text
      ctx.fillStyle = 'rgba(78, 172, 184, 0.35)';
      ctx.font = `${fontSize}px monospace`;
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw the character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Randomly reset some drops to top after they've reached a certain point
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 60);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.matrixRain} />;
};

// Export as a client-side only component
export default MatrixRain; 