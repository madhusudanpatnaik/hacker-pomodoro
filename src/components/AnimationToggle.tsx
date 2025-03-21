import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Animations.module.css';

type AnimationType = 'fluid' | 'code' | 'particles' | 'stars' | 'waves' | 'none';

const AnimationToggle: React.FC = () => {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>('fluid');
  const { themeColors } = useTheme();
  
  useEffect(() => {
    // Load saved preference if available
    try {
      const savedAnimation = localStorage.getItem('animationPreference');
      if (savedAnimation && ['fluid', 'code', 'particles', 'stars', 'waves', 'none'].includes(savedAnimation as string)) {
        setCurrentAnimation(savedAnimation as AnimationType);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Continue with default animation type
    }
  }, []);
  
  const changeAnimation = (type: AnimationType) => {
    setCurrentAnimation(type);
    
    try {
      localStorage.setItem('animationPreference', type);
      
      // Dispatch custom event for _app.tsx to listen to
      const event = new CustomEvent('toggleAnimation', { 
        detail: { type } 
      });
      window.dispatchEvent(event);
      
      // Provide visual feedback
      const feedbackElement = document.createElement('div');
      feedbackElement.textContent = `Animation set to ${type}`;
      feedbackElement.style.position = 'fixed';
      feedbackElement.style.bottom = '20px';
      feedbackElement.style.left = '50%';
      feedbackElement.style.transform = 'translateX(-50%)';
      feedbackElement.style.padding = '10px 20px';
      feedbackElement.style.background = 'rgba(0,0,0,0.8)';
      feedbackElement.style.color = '#fff';
      feedbackElement.style.borderRadius = '4px';
      feedbackElement.style.zIndex = '1000';
      document.body.appendChild(feedbackElement);
      
      // Remove after 2 seconds
      setTimeout(() => {
        document.body.removeChild(feedbackElement);
      }, 2000);
    } catch (error) {
      console.error('Error changing animation:', error);
      // Still update the UI even if storage/event fails
    }
  };
  
  // Manually force reset animation (for testing)
  const forceRefreshAnimation = () => {
    try {
      // Re-dispatch the current animation
      const event = new CustomEvent('toggleAnimation', { 
        detail: { type: currentAnimation } 
      });
      window.dispatchEvent(event);
      
      // Visual feedback
      const feedbackElement = document.createElement('div');
      feedbackElement.textContent = `Animation refreshed`;
      feedbackElement.style.position = 'fixed';
      feedbackElement.style.bottom = '20px';
      feedbackElement.style.left = '50%';
      feedbackElement.style.transform = 'translateX(-50%)';
      feedbackElement.style.padding = '10px 20px';
      feedbackElement.style.background = 'rgba(0,0,0,0.8)';
      feedbackElement.style.color = '#fff';
      feedbackElement.style.borderRadius = '4px';
      feedbackElement.style.zIndex = '1000';
      document.body.appendChild(feedbackElement);
      
      setTimeout(() => {
        document.body.removeChild(feedbackElement);
      }, 2000);
    } catch (error) {
      console.error('Error refreshing animation:', error);
    }
  };
  
  return (
    <div className={styles.animationToggle}>
      <div className={styles.animationToggleTitle}>Animation</div>
      <div className={styles.animationOptionsGrid}>
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'fluid' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('fluid')}
          style={{ borderColor: currentAnimation === 'fluid' ? themeColors.primary : 'transparent' }}
          aria-label="Fluid animation"
        >
          <div className={styles.animationIcon}>🌊</div>
          <span>Fluid</span>
        </button>
        
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'code' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('code')}
          style={{ borderColor: currentAnimation === 'code' ? themeColors.primary : 'transparent' }}
          aria-label="Matrix animation"
        >
          <div className={styles.animationIcon}>🖥️</div>
          <span>Matrix</span>
        </button>
        
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'particles' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('particles')}
          style={{ borderColor: currentAnimation === 'particles' ? themeColors.primary : 'transparent' }}
          aria-label="Particles animation"
        >
          <div className={styles.animationIcon}>✨</div>
          <span>Particles</span>
        </button>
        
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'stars' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('stars')}
          style={{ borderColor: currentAnimation === 'stars' ? themeColors.primary : 'transparent' }}
          aria-label="Stars animation"
        >
          <div className={styles.animationIcon}>🌟</div>
          <span>Stars</span>
        </button>
        
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'waves' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('waves')}
          style={{ borderColor: currentAnimation === 'waves' ? themeColors.primary : 'transparent' }}
          aria-label="Waves animation"
        >
          <div className={styles.animationIcon}>🌊</div>
          <span>Waves</span>
        </button>
        
        <button 
          className={`${styles.animationButton} ${currentAnimation === 'none' ? styles.activeAnimation : ''}`}
          onClick={() => changeAnimation('none')}
          style={{ borderColor: currentAnimation === 'none' ? themeColors.primary : 'transparent' }}
          aria-label="No animation"
        >
          <div className={styles.animationIcon}>🚫</div>
          <span>None</span>
        </button>
      </div>
      <button 
        onClick={forceRefreshAnimation}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          background: 'rgba(var(--primary-rgb), 0.2)',
          border: '1px solid var(--primary)',
          borderRadius: '4px',
          color: 'var(--text)',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Refresh Animation
      </button>
    </div>
  );
};

export default AnimationToggle; 