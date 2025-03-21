import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

const ParticlesAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { themeColors } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    const resize = () => {
      console.log('Resizing particles animation canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Parse color to RGB
    const parseColor = (color: string): [number, number, number] => {
      const hex = color.startsWith('#') 
        ? color.substring(1) 
        : color;
      
      // Convert hex to rgb
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
      }
      
      // Default fallback
      return [100, 100, 200];
    };
    
    // Get theme colors for animation
    const primaryColor = parseColor(themeColors.primary || '#00ff00');
    const secondaryColor = parseColor(themeColors.secondary || '#0088ff');
    const tertiaryColor = [255, 255, 255]; // White
    
    // Animation variables
    const particles: Particle[] = [];
    const particleCount = 120;
    const minSize = 2;
    const maxSize = 8;
    
    // Particle class with more varied movement patterns
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: [number, number, number];
      opacity: number;
      pattern: 'float' | 'circle' | 'zigzag';
      angle: number;
      amplitude: number;
      frequency: number;
      radius: number;
      centerX: number;
      centerY: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        
        // Determine movement pattern
        const patterns = ['float', 'circle', 'zigzag'];
        this.pattern = patterns[Math.floor(Math.random() * patterns.length)] as 'float' | 'circle' | 'zigzag';
        
        if (this.pattern === 'float') {
          this.speedX = (Math.random() - 0.5) * 1;
          this.speedY = (Math.random() - 0.5) * 1;
          // Additional float pattern parameters
          this.amplitude = Math.random() * 2 + 0.5;
          this.frequency = Math.random() * 0.02 + 0.01;
          this.angle = Math.random() * Math.PI * 2;
        } else if (this.pattern === 'circle') {
          // Circular motion
          this.radius = Math.random() * 100 + 50;
          this.centerX = this.x;
          this.centerY = this.y;
          this.speedX = Math.random() * 0.02 + 0.01; // Angular velocity
          this.angle = Math.random() * Math.PI * 2;
          this.speedY = 0; // Not used in circular motion
        } else {
          // Zigzag motion
          this.speedX = (Math.random() - 0.5) * 2;
          this.speedY = (Math.random() - 0.5) * 0.5;
          this.amplitude = Math.random() * 5 + 2;
          this.frequency = Math.random() * 0.1 + 0.02;
          this.angle = 0;
        }
        
        // Randomize color from theme colors or add white
        const colorRnd = Math.random();
        if (colorRnd < 0.4) {
          this.color = primaryColor;
        } else if (colorRnd < 0.8) {
          this.color = secondaryColor;
        } else {
          this.color = tertiaryColor;
        }
        
        this.opacity = Math.random() * 0.5 + 0.5;
      }
      
      update() {
        if (this.pattern === 'float') {
          // Basic movement with slight sine wave modulation
          this.x += this.speedX;
          this.y += this.speedY;
          this.y += Math.sin(this.angle) * this.amplitude * 0.1;
          this.angle += this.frequency;
          
          // Bounce off edges
          if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
          }
          
          if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
          }
        } else if (this.pattern === 'circle') {
          // Circular motion
          this.angle += this.speedX;
          this.x = this.centerX + Math.cos(this.angle) * this.radius;
          this.y = this.centerY + Math.sin(this.angle) * this.radius;
          
          // Adjust if off screen
          if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
            this.centerX = Math.random() * canvas.width;
            this.centerY = Math.random() * canvas.height;
          }
        } else {
          // Zigzag pattern
          this.x += this.speedX;
          this.y += this.speedY + Math.sin(this.angle) * this.amplitude;
          this.angle += this.frequency;
          
          // Bounce off edges
          if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
          }
          
          if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
          }
        }
        
        // Oscillate opacity for twinkling effect
        this.opacity = 0.5 + Math.sin(Date.now() * 0.001 * this.frequency) * 0.3;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        const [r, g, b] = this.color;
        
        // Add a glow effect with opacity
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    console.log('Starting particles animation');
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      console.log('Cleaning up particles animation');
    };
  }, [themeColors]);
  
  return <canvas ref={canvasRef} className={styles.particlesAnimation} />;
};

export default ParticlesAnimation; 