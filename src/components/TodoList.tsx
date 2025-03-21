import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Components.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoListProps {
  currentTask?: string;
  onTaskComplete?: (task: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ 
  currentTask = '',
  onTaskComplete
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load todos from localStorage
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const savedTodos = localStorage.getItem('hackerTodos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert string dates back to Date objects
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      }
    } catch (e) {
      console.error('Error parsing todos:', e);
      // Reset todos if there's an error
      setTodos([]);
      localStorage.removeItem('hackerTodos');
    }
  }, [isClient]);
  
  // Save todos to localStorage when they change
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem('hackerTodos', JSON.stringify(todos));
    } catch (e) {
      console.error('Error saving todos:', e);
    }
  }, [todos, isClient]);
  
  // Auto-populate the input if currentTask changes
  useEffect(() => {
    if (currentTask && !newTodo) {
      setNewTodo(currentTask);
    }
  }, [currentTask]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      addTodo();
    } else if (e.key === 'Escape') {
      setNewTodo('');
    }
  };
  
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date()
    };
    
    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    setNewTodo('');
    triggerGlitchEffect();
    
    // Focus input after adding
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  const toggleTodo = (id: number) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => {
        if (todo.id === id) {
          const updatedTodo = { ...todo, completed: !todo.completed };
          
          // If task is being marked as completed, notify parent
          if (!todo.completed && updatedTodo.completed && onTaskComplete) {
            onTaskComplete(todo.text);
          }
          
          return updatedTodo;
        }
        return todo;
      })
    );
    triggerGlitchEffect();
  };
  
  const deleteTodo = (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering toggleTodo
    }
    
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    triggerGlitchEffect();
  };
  
  const clearCompletedTodos = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    triggerGlitchEffect();
  };
  
  const triggerGlitchEffect = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };
  
  // Filter todos to show only those related to current task
  const filteredTodos = currentTask ? 
    todos.filter(todo => todo.text.toLowerCase().includes(currentTask.toLowerCase())) : 
    todos;
  
  // Sort by most recent first, completed items at the bottom
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  if (!isClient) {
    return <div className={styles.todoListContainer}>Loading...</div>;
  }
  
  return (
    <div className={`${styles.todoListContainer} ${isGlitching ? styles.glitchEffect : ''}`}>
      <div 
        className={styles.todoHeader} 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <span className={styles.hackPrefix}>&gt;</span> TASK MANAGER {isExpanded ? '[-]' : '[+]'}
      </div>
      
      {isExpanded && (
        <>
          <div className={styles.todoInputContainer}>
            <input 
              ref={inputRef}
              type="text" 
              value={newTodo}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add a new subtask..."
              className={styles.todoInput}
              aria-label="Add new task"
            />
            <button 
              className={styles.todoAddButton} 
              onClick={addTodo}
              aria-label="Add task"
              disabled={!newTodo.trim()}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>ADD</span>
            </button>
          </div>
          
          <div className={styles.todoList} role="list">
            {sortedTodos.length === 0 ? (
              <div className={styles.emptyTodoList}>
                <span className={styles.hackPrefix}>&gt;</span> No tasks found. Create a new task?
              </div>
            ) : (
              sortedTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                  role="listitem"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className={styles.todoCheckbox}
                    id={`todo-${todo.id}`}
                    aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                  />
                  <label 
                    htmlFor={`todo-${todo.id}`}
                    className={styles.todoText}
                  >
                    {todo.text}
                  </label>
                  <div className={styles.todoTime} title={new Date(todo.createdAt).toLocaleString()}>
                    {new Date(todo.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <button 
                    className={styles.todoDeleteButton}
                    onClick={(e) => deleteTodo(todo.id, e)}
                    aria-label={`Delete task "${todo.text}"`}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {sortedTodos.length > 0 && (
            <div className={styles.todoActions}>
              <button 
                className={styles.todoClearButton}
                onClick={clearCompletedTodos}
                disabled={!sortedTodos.some(todo => todo.completed)}
                aria-label="Clear completed tasks"
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>CLEAR COMPLETED</span>
              </button>
              <div className={styles.todoCounter}>
                {sortedTodos.filter(todo => !todo.completed).length} remaining
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TodoList; 