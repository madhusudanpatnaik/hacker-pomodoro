import { useState, useEffect } from 'react';
import styles from '../styles/Components.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCheckCircle, faClock, faFire, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface StatsProps {
  stats: {
    totalFocusTime: number;
    sessionsCompleted: number;
    tasksCompleted: number;
    streakDays: number;
  };
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [animatedTime, setAnimatedTime] = useState(0);
  const [animatedSessions, setAnimatedSessions] = useState(0);
  const [animatedTasks, setAnimatedTasks] = useState(0);
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Animate stats when they change
  useEffect(() => {
    if (!isClient) return;
    
    // Reset animation state when stats change significantly
    if (Math.abs(animatedTime - stats.totalFocusTime) > 60 ||
        Math.abs(animatedSessions - stats.sessionsCompleted) > 5 ||
        Math.abs(animatedTasks - stats.tasksCompleted) > 5 ||
        Math.abs(animatedStreak - stats.streakDays) > 2) {
      setAnimatedTime(0);
      setAnimatedSessions(0);
      setAnimatedTasks(0);
      setAnimatedStreak(0);
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }
    
    const timeInterval = setInterval(() => {
      setAnimatedTime(prev => {
        if (prev >= stats.totalFocusTime) {
          clearInterval(timeInterval);
          return stats.totalFocusTime;
        }
        return prev + Math.max(1, Math.floor((stats.totalFocusTime - prev) / 20));
      });
    }, 50);
    
    const sessionInterval = setInterval(() => {
      setAnimatedSessions(prev => {
        if (prev >= stats.sessionsCompleted) {
          clearInterval(sessionInterval);
          return stats.sessionsCompleted;
        }
        return prev + 1;
      });
    }, 200);
    
    const taskInterval = setInterval(() => {
      setAnimatedTasks(prev => {
        if (prev >= stats.tasksCompleted) {
          clearInterval(taskInterval);
          return stats.tasksCompleted;
        }
        return prev + 1;
      });
    }, 150);
    
    const streakInterval = setInterval(() => {
      setAnimatedStreak(prev => {
        if (prev >= stats.streakDays) {
          clearInterval(streakInterval);
          return stats.streakDays;
        }
        return prev + 1;
      });
    }, 300);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(sessionInterval);
      clearInterval(taskInterval);
      clearInterval(streakInterval);
    };
  }, [stats, isClient]);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  };
  
  if (!isClient) {
    return <div className={styles.statsContainer}>Loading stats...</div>;
  }
  
  return (
    <div className={`${styles.statsContainer} ${isGlitching ? styles.glitchEffect : ''}`}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <FontAwesomeIcon icon={faClock} />
        </div>
        <div className={styles.statValue}>{formatTime(animatedTime)}</div>
        <div className={styles.statLabel}>Focus Time</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <div className={styles.statValue}>{animatedSessions}</div>
        <div className={styles.statLabel}>Sessions</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <FontAwesomeIcon icon={faChartLine} />
        </div>
        <div className={styles.statValue}>{animatedTasks}</div>
        <div className={styles.statLabel}>Tasks Done</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>
          <FontAwesomeIcon icon={faFire} />
        </div>
        <div className={styles.statValue}>{animatedStreak}</div>
        <div className={styles.statLabel}>Day Streak</div>
      </div>
    </div>
  );
};

export default Stats; 