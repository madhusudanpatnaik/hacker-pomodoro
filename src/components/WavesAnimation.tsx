import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

const WavesAnimation: React.FC = () => {
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
      console.log('Resizing waves animation canvas');
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
    
    // Get theme colors for waves
    const primaryColor = parseColor(themeColors.primary || '#60a5fa');
    const secondaryColor = parseColor(themeColors.secondary || '#7dd3fc');
    
    // Wave parameters
    const waves = [];
    const waveCount = 5;
    
    // Wave class
    class Wave {
      amplitude: number;
      period: number;
      phase: number;
      color: [number, number, number];
      opacity: number;
      yOffset: number;
      thickness: number;
      noiseScale: number;
      speed: number;
      
      constructor(index: number, total: number) {
        // Creates waves with different properties
        this.amplitude = 20 + (index / total) * 60; // varies from 20 to 80
        this.period = 200 + (index / total) * 600; // varies the wavelength
        this.phase = Math.random() * Math.PI * 2; // random starting phase
        
        // Different colors based on position
        if (index === 0) {
          // First wave (deepest) is most opaque
          this.color = primaryColor;
          this.opacity = 0.5;
        } else if (index === total - 1) {
          // Last wave (highest) is semi-transparent
          this.color = secondaryColor;
          this.opacity = 0.3;
        } else {
          // Middle waves blend between colors
          const blend = index / (total - 1);
          this.color = [
            Math.round(primaryColor[0] * (1 - blend) + secondaryColor[0] * blend),
            Math.round(primaryColor[1] * (1 - blend) + secondaryColor[1] * blend),
            Math.round(primaryColor[2] * (1 - blend) + secondaryColor[2] * blend)
          ];
          this.opacity = 0.4 - (index / total) * 0.2; // Varies from 0.4 to 0.2
        }
        
        // Y position offset - stacks waves from bottom to top
        this.yOffset = canvas.height - canvas.height * 0.3 - (index / total) * canvas.height * 0.4;
        
        // Wave thickness varies
        this.thickness = 80 - (index / total) * 30; // Thicker at bottom, thinner at top
        
        // Noise scale for natural wave motion
        this.noiseScale = 0.01 + (index / total) * 0.02;
        
        // Speed varies by layer
        this.speed = 0.001 + (index / total) * 0.001;
      }
      
      draw(ctx: CanvasRenderingContext2D, time: number) {
        const [r, g, b] = this.color;
        
        // Create gradient for the wave fill
        const gradient = ctx.createLinearGradient(0, this.yOffset - this.amplitude, 0, this.yOffset + this.thickness);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Start at the left side
        ctx.moveTo(0, canvas.height);
        
        // Draw wave to right edge
        for (let x = 0; x < canvas.width; x += 5) {
          // Calculate y position of the wave at this x
          // Base sine wave + noise for more natural effect
          const y = this.yOffset + 
                    Math.sin((x / this.period) + this.phase + time * this.speed) * this.amplitude +
                    (Math.sin((x * this.noiseScale) + time * this.speed * 2) * this.amplitude * 0.2);
          
          ctx.lineTo(x, y);
        }
        
        // Complete the path to bottom-right corner and back to start
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw highlighted wave line on top for shine effect
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r + 30}, ${g + 30}, ${b + 30}, ${this.opacity * 0.7})`;
        ctx.lineWidth = 2;
        
        for (let x = 0; x < canvas.width; x += 5) {
          const y = this.yOffset + 
                    Math.sin((x / this.period) + this.phase + time * this.speed) * this.amplitude +
                    (Math.sin((x * this.noiseScale) + time * this.speed * 2) * this.amplitude * 0.2);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
    }
    
    // Initialize waves
    for (let i = 0; i < waveCount; i++) {
      waves.push(new Wave(i, waveCount));
    }
    
    // Animation loop
    const animate = () => {
      // Use time for animation
      const time = Date.now();
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves from back to front
      for (let i = 0; i < waves.length; i++) {
        waves[i].draw(ctx, time);
      }
      
      // Add subtle reflections on top of waves
      drawReflections(ctx, time);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Helper function to draw light reflections on water surface
    const drawReflections = (ctx: CanvasRenderingContext2D, time: number) => {
      const reflectionCount = 10;
      
      for (let i = 0; i < reflectionCount; i++) {
        // Position based on time
        const x = ((time * 0.02 + i * 500) % canvas.width);
        const y = waves[waveCount - 1].yOffset - 10 + Math.sin(time * 0.001 + i) * 20;
        const size = 20 + Math.sin(time * 0.002 + i) * 10;
        
        // Draw reflection
        const gradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(x, y, size, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    console.log('Starting waves animation');
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      console.log('Cleaning up waves animation');
    };
  }, [themeColors]);
  
  return <canvas ref={canvasRef} className={styles.wavesAnimation} />;
};

export default WavesAnimation; 