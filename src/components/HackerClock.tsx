import { useState, useEffect } from 'react';
import styles from '../styles/Components.module.css';

interface HackerClockProps {
  showDate?: boolean;
  showSeconds?: boolean;
  is24Hour?: boolean;
}

const HackerClock: React.FC<HackerClockProps> = ({ 
  showDate = true, 
  showSeconds = true,
  is24Hour = true
}) => {
  const [time, setTime] = useState<Date | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setTime(new Date());
    
    const interval = setInterval(() => {
      setTime(new Date());
      setIsBlinking(prev => !prev);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = () => {
    if (!time || !isMounted) {
      return (
        <div className={styles.clockTime}>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>0</span>
          <span className={styles.separator}>:</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>0</span>
          {showSeconds && (
            <>
              <span className={styles.separator}>:</span>
              <span className={styles.digit}>0</span>
              <span className={styles.digit}>0</span>
            </>
          )}
          {!is24Hour && <span className={styles.ampm}>AM</span>}
        </div>
      );
    }
    
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    let ampm = '';
    
    if (!is24Hour) {
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }
    
    hours = hours.toString().padStart(2, '0');
    
    return (
      <div className={styles.clockTime}>
        <span className={styles.digit}>{hours.charAt(0)}</span>
        <span className={styles.digit}>{hours.charAt(1)}</span>
        <span className={`${styles.separator} ${isBlinking ? styles.blink : ''}`}>:</span>
        <span className={styles.digit}>{minutes.charAt(0)}</span>
        <span className={styles.digit}>{minutes.charAt(1)}</span>
        
        {showSeconds && (
          <>
            <span className={`${styles.separator} ${isBlinking ? styles.blink : ''}`}>:</span>
            <span className={styles.digit}>{seconds.charAt(0)}</span>
            <span className={styles.digit}>{seconds.charAt(1)}</span>
          </>
        )}
        
        {!is24Hour && <span className={styles.ampm}>{ampm}</span>}
      </div>
    );
  };
  
  const formatDate = () => {
    if (!time || !isMounted) return "Loading...";
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    };
    
    return time.toLocaleDateString('en-US', options);
  };
  
  return (
    <div className={styles.hackerClock}>
      {formatTime()}
      {showDate && <div className={styles.clockDate}>{formatDate()}</div>}
    </div>
  );
};

export default HackerClock; 