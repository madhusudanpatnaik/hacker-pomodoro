import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Prevent fontawesome from adding its CSS since we did it manually above
config.autoAddCss = false;

// Define custom event type for better type safety
interface ToggleAnimationEvent extends CustomEvent {
  detail: { type: 'fluid' | 'code' | 'particles' | 'stars' | 'waves' | 'none' };
}

// Dynamically import animation components to avoid SSR issues
const FluidAnimation = dynamic(() => import('../components/FluidAnimation'), { ssr: false });
const CodeRain = dynamic(() => import('../components/CodeRain'), { ssr: false });
const ParticlesAnimation = dynamic(() => import('../components/ParticlesAnimation'), { ssr: false });
const StarsAnimation = dynamic(() => import('../components/StarsAnimation'), { ssr: false });
const WavesAnimation = dynamic(() => import('../components/WavesAnimation'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const [animationType, setAnimationType] = useState<'fluid' | 'code' | 'particles' | 'stars' | 'waves' | 'none'>('fluid');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag for SSR compatibility
    setIsClient(true);
    
    // Set default animation if one isn't already set
    try {
      let currentAnimation = localStorage.getItem('animationPreference');
      
      // Force reinitialize animation preference
      if (!currentAnimation || !['fluid', 'code', 'particles', 'stars', 'waves', 'none'].includes(currentAnimation)) {
        currentAnimation = 'fluid';
        localStorage.setItem('animationPreference', currentAnimation);
      }
      
      // Set the animation type from local storage
      setAnimationType(currentAnimation as 'fluid' | 'code' | 'particles' | 'stars' | 'waves' | 'none');
      
      // Apply animation immediately
      const event = new CustomEvent('toggleAnimation', { 
        detail: { type: currentAnimation as 'fluid' | 'code' | 'particles' | 'stars' | 'waves' | 'none' } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Continue with default animation type
    }
    
    // Listen for animation toggle events
    const handleAnimationToggle = (e: Event) => {
      try {
        const customEvent = e as ToggleAnimationEvent;
        if (customEvent.detail && customEvent.detail.type) {
          setAnimationType(customEvent.detail.type);
          console.log('Animation changed to:', customEvent.detail.type);
        }
      } catch (error) {
        console.error('Error handling animation toggle event:', error);
      }
    };
    
    window.addEventListener('toggleAnimation', handleAnimationToggle);
    
    return () => {
      window.removeEventListener('toggleAnimation', handleAnimationToggle);
    };
  }, []);
  
  return (
    <ThemeProvider>
      {/* Show animations regardless of client state */}
      {animationType === 'fluid' && <FluidAnimation />}
      {animationType === 'code' && <CodeRain />}
      {animationType === 'particles' && <ParticlesAnimation />}
      {animationType === 'stars' && <StarsAnimation />}
      {animationType === 'waves' && <WavesAnimation />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
} 