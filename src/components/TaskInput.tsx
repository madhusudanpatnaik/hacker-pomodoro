import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Components.module.css';

interface TaskInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onGlitchEffect?: () => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ 
  value = '', 
  onChange, 
  placeholder = "What are you working on?",
  onGlitchEffect
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setShowSuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Sync input value with prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSubmit = () => {
    if (inputValue.trim()) {
      onChange?.(inputValue);
      onGlitchEffect?.();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && suggestions) {
      e.preventDefault();
      const suggestionElements = dropdownRef.current?.querySelectorAll(`.${styles.taskOption}`);
      if (suggestionElements && suggestionElements.length > 0) {
        (suggestionElements[0] as HTMLElement).focus();
      }
    }
  };
  
  const commonTasks = [
    'Coding', 
    'Reading',
    'Writing',
    'Learning',
    'Problem solving', 
    'Studying',
    'Research',
    'Planning'
  ];
  
  const selectTask = (task: string) => {
    setInputValue(task);
    onChange?.(task);
    setShowSuggestions(false);
    onGlitchEffect?.();
  };
  
  if (!isClient) {
    return <div className={styles.taskInputContainer}>Loading...</div>;
  }
  
  return (
    <div className={styles.taskInputContainer}>
      <div className={styles.inputContainer}>
        <input 
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          onFocus={() => setShowSuggestions(true)}
          aria-label="Task input"
        />
        <button 
          onClick={handleSubmit}
          className={styles.addButton}
          aria-label="Set task"
        >
          Set Task
        </button>
      </div>
      
      {suggestions && (
        <div 
          ref={dropdownRef}
          className={styles.taskDropdown}
          role="listbox"
          aria-label="Task suggestions"
        >
          {commonTasks.map((task, index) => (
            <div 
              key={index}
              className={`${styles.taskOption} ${task === value ? styles.active : ''}`}
              onClick={() => selectTask(task)}
              role="option"
              aria-selected={task === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectTask(task);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const next = e.currentTarget.nextElementSibling;
                  if (next) {
                    (next as HTMLElement).focus();
                  }
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const prev = e.currentTarget.previousElementSibling;
                  if (prev) {
                    (prev as HTMLElement).focus();
                  } else {
                    inputRef.current?.focus();
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }
              }}
            >
              {task}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskInput; 