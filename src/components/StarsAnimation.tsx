import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

const StarsAnimation: React.FC = () => {
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
      console.log('Resizing stars animation canvas');
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
      return [255, 255, 255];
    };
    
    // Get theme colors for stars
    const primaryColor = parseColor(themeColors.primary || '#60a5fa'); // Blue-ish
    const secondaryColor = parseColor(themeColors.secondary || '#7dd3fc'); // Light blue
    
    // Stars variables
    const stars: Star[] = [];
    const starCount = 200;
    const shootingStarCount = 5;
    
    // Star types
    type StarType = 'tiny' | 'small' | 'medium' | 'large' | 'shooting';
    
    // Star class
    class Star {
      x: number;
      y: number;
      size: number;
      color: [number, number, number];
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      type: StarType;
      
      // For shooting stars
      speedX?: number;
      speedY?: number;
      trail?: number;
      life?: number;
      maxLife?: number;
      
      constructor(type: StarType = 'small') {
        this.type = type;
        
        if (type === 'shooting') {
          // Shooting star specific properties
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * (canvas.height / 3); // Start in top third
          this.size = Math.random() * 2 + 2;
          this.speedX = (Math.random() - 0.5) * 10;
          this.speedY = Math.random() * 5 + 5;
          this.trail = 10 + Math.random() * 20;
          this.maxLife = 100 + Math.random() * 50;
          this.life = this.maxLife;
        } else {
          // Regular star
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          
          // Size based on type
          if (type === 'tiny') {
            this.size = Math.random() * 1 + 0.5;
          } else if (type === 'small') {
            this.size = Math.random() * 1.5 + 1;
          } else if (type === 'medium') {
            this.size = Math.random() * 2 + 2;
          } else {
            this.size = Math.random() * 3 + 3;
          }
        }
        
        // Star color varies between white and theme colors
        const colorRand = Math.random();
        if (colorRand < 0.7) {
          // White to blue-ish
          this.color = [
            Math.min(255, 220 + Math.floor(Math.random() * 35)),
            Math.min(255, 220 + Math.floor(Math.random() * 35)),
            Math.min(255, 235 + Math.floor(Math.random() * 20))
          ];
        } else if (colorRand < 0.85) {
          this.color = primaryColor;
        } else {
          this.color = secondaryColor;
        }
        
        // Initial opacity and twinkle settings
        this.opacity = Math.random() * 0.5 + 0.5;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2; // Offset so not all stars twinkle together
      }
      
      update() {
        if (this.type === 'shooting') {
          // Update shooting star position
          this.x += this.speedX!;
          this.y += this.speedY!;
          this.life! -= 1;
          
          // Regenerate if out of bounds or life expired
          if (this.life! <= 0 || this.x < 0 || this.x > canvas.width || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * (canvas.height / 3);
            this.life = this.maxLife;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = Math.random() * 5 + 5;
          }
        } else {
          // Regular star twinkling effect
          this.opacity = 0.5 + 0.5 * Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset);
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        const [r, g, b] = this.color;
        
        if (this.type === 'shooting') {
          // Shooting star with trail
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
          ctx.lineWidth = this.size;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - this.speedX! * (this.trail! / this.maxLife! * this.life!), 
                     this.y - this.speedY! * (this.trail! / this.maxLife! * this.life!));
          ctx.stroke();
          
          // Star head
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular star with glow
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
          
          // Different star shapes based on size
          if (this.type === 'large') {
            // Draw star shape for larger stars
            this.drawStarShape(ctx, this.x, this.y, 5, this.size, this.size / 2);
          } else if (this.type === 'medium' && Math.random() > 0.7) {
            // Some medium stars get star shapes
            this.drawStarShape(ctx, this.x, this.y, 5, this.size, this.size / 2);
          } else {
            // Simple circle for smaller stars
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow for bigger stars
            if (this.type !== 'tiny') {
              const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
              );
              gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.3})`);
              gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      
      // Helper method to draw star shape
      drawStarShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius;
          y = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;
          
          x = cx + Math.cos(rot) * innerRadius;
          y = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Initialize stars with different sizes
    for (let i = 0; i < starCount; i++) {
      const rand = Math.random();
      let type: StarType = 'small';
      
      if (rand < 0.6) {
        type = 'tiny';
      } else if (rand < 0.85) {
        type = 'small';
      } else if (rand < 0.97) {
        type = 'medium';
      } else {
        type = 'large';
      }
      
      stars.push(new Star(type));
    }
    
    // Add shooting stars
    for (let i = 0; i < shootingStarCount; i++) {
      stars.push(new Star('shooting'));
    }
    
    // Animation loop
    const animate = () => {
      // Almost fully clear canvas for stars
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    console.log('Starting stars animation');
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      console.log('Cleaning up stars animation');
    };
  }, [themeColors]);
  
  return <canvas ref={canvasRef} className={styles.starsAnimation} />;
};

export default StarsAnimation; 