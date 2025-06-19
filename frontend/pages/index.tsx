import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Task } from '../types';

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
      </header>
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All
        </button>
        <button className={filter === 'todo' ? 'active' : ''} onClick={() => setFilter('todo')}>
          Todo
        </button>
        <button
          className={filter === 'in_progress' ? 'active' : ''}
          onClick={() => setFilter('in_progress')}
        >
          In Progress
        </button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
          Done
        </button>
        <Link href="/add">
          <button className="submit-btn">Add Task</button>
        </Link>
      </div>
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
              <p className={`status ${task.status}`}>{task.status.replace('_', ' ')}</p>
            </div>
            <div className="task-actions">
              <Link href={`/edit/${task.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;