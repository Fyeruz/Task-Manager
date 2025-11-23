import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="task-list-container">
      <h2>My Tasks</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks">
        {tasks.map(task => (
          <div key={task._id} className="task-item">
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="task-date">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="task-actions">
              <label>
                Complete:
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleUpdateTask(task._id, { completed: e.target.checked })}
                />
              </label>
              <button 
                onClick={() => handleDeleteTask(task._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <p>No tasks yet. Create your first task above!</p>
        )}
      </div>
    </div>
  );
}

export default TaskList;