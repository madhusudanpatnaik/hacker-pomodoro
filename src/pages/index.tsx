import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import { useTheme } from '../contexts/ThemeContext';
import Stats from '../components/Stats';
import TaskInput from '../components/TaskInput';
import TodoList from '../components/TodoList';
import ParallaxBackground from '../components/ParallaxBackground';
import FullscreenMenu from '../components/FullscreenMenu';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faPause, faStop, faCog, 
  faCheck, faListCheck, faChartLine, 
  faHistory, faVolumeMute, faVolumeHigh
} from '@fortawesome/free-solid-svg-icons';

const ClientGlitchText = dynamic(() => import('../components/ClientGlitchText'), { ssr: false });

// Motivational quotes array
const QUOTES = [
  "Code like no one is watching.",
  "When in doubt, console.log() it out.",
  "The best error message is the one that never shows up.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "One line of working code is worth 500 of specification.",
  "Clean code always looks like it was written by someone who cares.",
  "The only way to learn a new programming language is by writing programs in it.",
  "Debugging is twice as hard as writing the code in the first place."
];

export default function Home() {
  // Theme
  const { currentTheme } = useTheme();
  
  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [muted, setMuted] = useState(false);
  
  // Task state
  const [currentTask, setCurrentTask] = useState('');
  
  // UI states
  const [menuOpen, setMenuOpen] = useState(false);
  const [quote, setQuote] = useState('');
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    tasksCompleted: 0,
    streakDays: 0
  });
  
  // Client-side only code
  const [isClient, setIsClient] = useState(false);
  
  // Timer modes 
  const timerModes = [
    { name: 'Work', value: 'work', defaultMinutes: 25 },
    { name: 'Short Break', value: 'shortBreak', defaultMinutes: 5 },
    { name: 'Long Break', value: 'longBreak', defaultMinutes: 15 }
  ];
  
  // Initialize
  useEffect(() => {
    setIsClient(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    
    // Load saved stats
    const savedStats = localStorage.getItem('hackerPomodoro_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    // Set up keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey && 
          !(document.activeElement instanceof HTMLInputElement) && 
          !(document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        resetTimer();
      } else if (e.key === 'm' || e.key === 'M') {
        setMenuOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  // Productivity stats
  useEffect(() => {
    if (!isClient) return;
    
    try {
      // Track current date for streak tracking
      const today = new Date().toLocaleDateString();
      const lastActive = localStorage.getItem('hackerPomodoro_lastActive');
      
      // Load saved stats
      const savedStats = localStorage.getItem('hackerPomodoro_stats');
      let parsedStats = {
        totalFocusTime: 0,
        sessionsCompleted: 0,
        tasksCompleted: 0,
        streakDays: 1
      };
      
      if (savedStats) {
        try {
          parsedStats = JSON.parse(savedStats);
          
          // Handle streaks logic
          if (lastActive) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString();
            
            // If last active was yesterday, continue streak
            // If it's still today, maintain streak
            // Otherwise, reset streak to 1
            if (lastActive !== today && lastActive !== yesterdayStr) {
              // Streak broken, reset to 1 for today
              parsedStats.streakDays = 1;
            }
          }
        } catch (error) {
          console.error("Error parsing saved stats:", error);
          // Keep default stats if parsing fails
        }
      }
      
      // Set the stats in state
      setStats(parsedStats);
      
      // Update last active date to today (only if they haven't already been active today)
      if (lastActive !== today) {
        localStorage.setItem('hackerPomodoro_lastActive', today);
      }
    } catch (error) {
      console.error("Error in productivity stats tracking:", error);
    }
  }, [isClient]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            clearInterval(interval!);
            setIsActive(false);
            playNotificationSound();
            
            if (mode === 'work') {
              // Completed a work session
              const newSessionsCompleted = sessionsCompleted + 1;
              setSessionsCompleted(newSessionsCompleted);
              
              // Update stats with accurate focus time
              const selectedMode = timerModes.find(m => m.value === 'work');
              const focusMinutes = selectedMode ? selectedMode.defaultMinutes : 25;
              
              try {
                const today = new Date().toLocaleDateString();
                const lastActive = localStorage.getItem('hackerPomodoro_lastActive');
                const newStats = {
                  ...stats,
                  totalFocusTime: stats.totalFocusTime + focusMinutes,
                  sessionsCompleted: stats.sessionsCompleted + 1,
                };
                
                // Only increment streak if this is first session of the day
                if (lastActive !== today) {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const yesterdayStr = yesterday.toLocaleDateString();
                  
                  // If last active was yesterday or this is first time, increase streak
                  if (lastActive === yesterdayStr || !lastActive) {
                    newStats.streakDays = stats.streakDays + 1;
                  }
                  
                  // Update last active date
                  localStorage.setItem('hackerPomodoro_lastActive', today);
                }
                
                setStats(newStats);
                localStorage.setItem('hackerPomodoro_stats', JSON.stringify(newStats));
              } catch (error) {
                console.error("Error updating stats:", error);
              }
              
              // Determine next mode
              if (newSessionsCompleted % 4 === 0) {
                setMode('longBreak');
                setMinutes(15);
              } else {
                setMode('shortBreak');
                setMinutes(5);
              }
            } else {
              // Break finished, go back to work
              setMode('work');
              setMinutes(25);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, minutes, seconds, mode, sessionsCompleted, stats, timerModes]);
  
  // Timer controls
  const toggleTimer = useCallback(() => {
    if (isActive) {
      // If already active, toggle pause state
      setIsPaused(!isPaused);
    } else {
      // If not active, start timer
      setIsActive(true);
      setIsPaused(false);
    }
  }, [isActive, isPaused]);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    
    // Reset to default values based on mode
    const currentMode = timerModes.find(m => m.value === mode);
    if (currentMode) {
      setMinutes(currentMode.defaultMinutes);
    }
    setSeconds(0);
  }, [mode, timerModes]);
  
  const changeTimerMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setIsPaused(false);
    setMode(newMode);
    
    // Set default time for the selected mode
    const selectedMode = timerModes.find(m => m.value === newMode);
    if (selectedMode) {
      setMinutes(selectedMode.defaultMinutes);
    }
    setSeconds(0);
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  // Play notification sound
  const playNotificationSound = () => {
    if (!muted && isClient) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.error('Could not play notification sound', e));
    }
  };
  
  // Helper functions
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getModeIndicatorClass = useMemo(() => {
    return `${styles.modeIndicator} ${
      mode === 'work' 
        ? styles.workMode 
        : mode === 'shortBreak' 
          ? styles.shortBreakMode 
          : styles.longBreakMode
    }`;
  }, [mode]);
  
  const getTimerButtonIcon = useMemo(() => {
    if (!isActive) {
      return faPlay;
    } else if (isPaused) {
      return faPlay;
    } else {
      return faPause;
    }
  }, [isActive, isPaused]);
  
  // Custom timer settings
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const adjustTimer = (amount: number) => {
    if (!isActive) {
      setMinutes(prev => Math.max(1, Math.min(60, prev + amount)));
    }
  };
  
  // Update stats when tasks are completed
  const completeTask = useCallback((taskName: string) => {
    if (!isClient) return;
    
    try {
      const newStats = {
        ...stats,
        tasksCompleted: stats.tasksCompleted + 1
      };
      setStats(newStats);
      localStorage.setItem('hackerPomodoro_stats', JSON.stringify(newStats));
      
      // Play sound notification for task completion
      if (!muted) {
        const audio = new Audio('/task-complete.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => {
          console.error('Could not play task complete sound', e);
          // Fallback for browsers that block autoplay
          // We could show a visual notification instead
        });
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  }, [stats, muted, isClient]);
  
  // Render
  return (
    <>
      <Head>
        <title>Hacker Pomodoro | {mode === 'work' ? 'Focus' : 'Break'} {formatTime(minutes, seconds)}</title>
      </Head>
      
      <main className={styles.main}>
        {isClient && <ParallaxBackground />}
        
        <div className={styles.themeSwitcherContainer}>
          <ThemeSwitcher />
        </div>
        
        <div className={styles.container}>
          <div className={styles.pomodoroContainer}>
            <div className={styles.headerArea}>
              <h1 className={styles.appTitle}>
                <span>&lt;</span>
                <ClientGlitchText text="Hacker Pomodoro" onHover={true} />
                <span>/&gt;</span>
              </h1>
              <button 
                className={styles.menuToggle}
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <FontAwesomeIcon icon={faCog} />
              </button>
            </div>
            
            <div className={styles.timerSection}>
              <div className={getModeIndicatorClass}>
                {mode === 'work' 
                  ? <><FontAwesomeIcon icon={faCheck} /> WORK</>
                  : mode === 'shortBreak' 
                    ? <><FontAwesomeIcon icon={faHistory} /> SHORT BREAK</>
                    : <><FontAwesomeIcon icon={faHistory} /> LONG BREAK</>
                }
                
                {/* Mode selector */}
                <div className={styles.modeSelector}>
                  {timerModes.map(timerMode => (
                    <button
                      key={timerMode.value}
                      className={`${styles.modeButton} ${mode === timerMode.value ? styles.activeMode : ''}`}
                      onClick={() => changeTimerMode(timerMode.value as 'work' | 'shortBreak' | 'longBreak')}
                      disabled={isActive && !isPaused}
                    >
                      {timerMode.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.timer}>
                {formatTime(minutes, seconds)}
                
                {/* Time adjustment buttons */}
                {!isActive && (
                  <div className={styles.timeAdjust}>
                    <button 
                      className={styles.adjustButton}
                      onClick={() => adjustTimer(-1)}
                      aria-label="Decrease time"
                    >
                      -
                    </button>
                    <button 
                      className={styles.adjustButton}
                      onClick={() => adjustTimer(1)}
                      aria-label="Increase time"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              
              <div className={styles.controls}>
                <button 
                  className={styles.timerButton}
                  onClick={toggleTimer}
                  aria-label={isActive && !isPaused ? "Pause timer" : "Start timer"}
                >
                  <FontAwesomeIcon icon={getTimerButtonIcon} />
                </button>
                
                <button 
                  className={styles.resetButton}
                  onClick={resetTimer}
                  aria-label="Reset timer"
                >
                  <FontAwesomeIcon icon={faStop} />
                </button>
                
                <button 
                  className={`${styles.soundButton} ${muted ? styles.muted : ''}`}
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute sound" : "Mute sound"}
                >
                  <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeHigh} />
                </button>
              </div>
            </div>
            
            <div className={styles.quoteArea}>
              <p className={styles.quote}>&quot;{quote}&quot;</p>
            </div>
            
            <div className={styles.taskSection}>
              <div className={styles.tasksHeader}>
                <h2><FontAwesomeIcon icon={faListCheck} /> Tasks</h2>
              </div>
              
              {isClient && (
                <>
                  <TaskInput 
                    value={currentTask}
                    onChange={(newTask) => setCurrentTask(newTask)} 
                    placeholder="What are you working on now?"
                    onGlitchEffect={() => {
                      // Optional: Add glitch effect when task changes
                      const glitchEvent = new CustomEvent('glitchEffect');
                      window.dispatchEvent(glitchEvent);
                      
                      // Consider task completion if changing tasks during a session
                      if (currentTask && isActive && !isPaused) {
                        completeTask(currentTask);
                      }
                    }}
                  />
                  <TodoList 
                    currentTask={currentTask}
                    onTaskComplete={(task) => {
                      if (task) {
                        completeTask(task);
                      }
                    }}
                  />
                </>
              )}
            </div>
            
            <div className={styles.statsSection}>
              <h2><FontAwesomeIcon icon={faChartLine} /> Productivity Stats</h2>
              <Stats stats={stats} />
            </div>
          </div>
        </div>
        
        {isClient && (
          <FullscreenMenu 
            isOpen={menuOpen} 
            onClose={() => setMenuOpen(false)} 
          />
        )}
      </main>
    </>
  );
} 