import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Task } from '../../types';

const EditTask = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
  });

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${id}`);
      setTask({
        ...response.data,
        dueDate: response.data.dueDate
          ? new Date(response.data.dueDate).toISOString().split('T')[0]
          : '',
      });
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, task);
      router.push('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Edit Task</h1>
      </header>
      <div className="form-container">
        <h2>Update Task</h2>
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
              Update Task
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

export default EditTask;