import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Box, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import apiClient from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    due_date: '',
    completed: false
  });

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', due_date: '', completed: false });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const task = tasks.find(task => task.id === id);
      if (task) {
        const updatedTask = { ...task, completed: !task.completed };
        await apiClient.put(`/tasks/${id}`, updatedTask);
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      }
    } catch (error) {
      console.error(`Error toggling task ${id}:`, error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TODO-List Dashboard
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
          <Typography>Total Tasks: {tasks.length}</Typography>
          <Typography>Completed: {tasks.filter(task => task.completed).length}</Typography>
        </Box>

        <Box sx={{ display: 'flex', my: 2, gap: 1 }}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'contained' : 'outlined'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.due_date}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={task.completed ? 'success' : 'primary'}
                      onClick={() => handleToggleComplete(task.id)}
                    >
                      {task.completed ? 'Completed' : 'Pending'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {isAdding && (
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>Add New Task</Typography>
            <form onSubmit={handleAddTask}>
              <TextField
                fullWidth
                label="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                margin="normal"
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" color="primary">Add Task</Button>
                <Button variant="outlined" onClick={() => setIsAdding(false)}>Cancel</Button>
              </Box>
            </form>
          </Box>
        )}

        {!isAdding && (
          <Box sx={{ my: 4 }}>
            <Button variant="contained" startIcon={<Add />} onClick={() => setIsAdding(true)}>
              Add Task
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TaskList;
