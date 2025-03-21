import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

const FluidAnimation: React.FC = () => {
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
      console.log('Resizing fluid animation canvas');
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
    
    // Animation variables
    const particles: Particle[] = [];
    const particleCount = 80; // Increased from 50
    const maxVelocity = 2.5; // Increased from 2
    const minSize = 4;  // Increased from 3
    const maxSize = 15; // Increased from 12
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: [number, number, number];
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = (Math.random() - 0.5) * maxVelocity;
        this.speedY = (Math.random() - 0.5) * maxVelocity;
        this.color = Math.random() > 0.5 ? primaryColor : secondaryColor;
      }
      
      update() {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -1;
        }
        
        if (this.y > canvas.height || this.y < 0) {
          this.speedY *= -1;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        const [r, g, b] = this.color;
        // Add a glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines
    const connectParticles = () => {
      const maxDistance = 200; // Increased from 180
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            const [r1, g1, b1] = particles[i].color;
            const [r2, g2, b2] = particles[j].color;
            
            // Blend colors
            const r = Math.floor((r1 + r2) / 2);
            const g = Math.floor((g1 + g2) / 2);
            const b = Math.floor((b1 + b2) / 2);
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y, 
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity * 0.7})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2; // Increased from 1.5
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      // Use a translucent background to create a trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Connect particles
      connectParticles();
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    console.log('Starting fluid animation');
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      console.log('Cleaning up fluid animation');
    };
  }, [themeColors]);
  
  return <canvas ref={canvasRef} className={styles.fluidAnimation} />;
};

export default FluidAnimation; 