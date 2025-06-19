import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Task } from '../types';

const AddTask = () => {
  const router = useRouter();
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tasks', task);
      router.push('/');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Add Task</h1>
      </header>
      <div className="form-container">
        <h2>New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={task.status} onChange={handleChange}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Add Task
            </button>
            <button type="button" className="cancel-btn" onClick={() => router.push('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;