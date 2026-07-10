import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
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
    completed: false,
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label={`${completedTasks} of ${totalTasks} tasks completed`}
              sx={{
                mr: 1,
                fontFamily: '"Playfair Display", Georgia, serif',
                backgroundColor: 'rgba(74, 124, 46, 0.12)',
                color: '#2D4A1E',
                border: '1px solid rgba(74, 124, 46, 0.25)',
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'contained' : 'outlined'}
              onClick={() => setFilter(f)}
              size="small"
              color={filter === f ? 'primary' : 'secondary'}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Box>
      </Paper>

      {filteredTasks.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#6B6359',
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              mb: 1,
            }}
          >
            The cupboards are bare...
          </Typography>
          <Typography variant="body2" sx={{ color: '#9E9488', mb: 3 }}>
            No tasks here yet. Time for a second breakfast of productivity!
          </Typography>
          {!isAdding && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setIsAdding(true)}
            >
              Add a New Task
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50 }}></TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ width: 60 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow
                  key={task.id}
                  sx={{
                    opacity: task.completed ? 0.6 : 1,
                    '&:hover': {
                      backgroundColor: 'rgba(245, 230, 204, 0.4) !important',
                    },
                  }}
                >
                  <TableCell>
                    <IconButton
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{
                        color: task.completed ? '#4A7C2E' : '#C4A882',
                        '&:hover': {
                          backgroundColor: 'rgba(74, 124, 46, 0.1)',
                        },
                      }}
                      size="small"
                    >
                      {task.completed ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <RadioButtonUnchecked fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#9E9488' : '#3E2723',
                      }}
                    >
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: '#6B6359', fontStyle: task.description ? 'normal' : 'italic' }}
                    >
                      {task.description || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#6B6359' }}>
                      {task.due_date || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.completed ? 'Completed' : 'Pending'}
                      size="small"
                      sx={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        backgroundColor: task.completed
                          ? 'rgba(74, 124, 46, 0.15)'
                          : 'rgba(212, 168, 67, 0.15)',
                        color: task.completed ? '#2D4A1E' : '#6B4423',
                        border: `1px solid ${
                          task.completed ? 'rgba(74, 124, 46, 0.3)' : 'rgba(212, 168, 67, 0.3)'
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      size="small"
                      sx={{
                        color: '#8B3A3A',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 58, 58, 0.1)',
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isAdding && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#3E2723',
            }}
          >
            A New Task, Precious
          </Typography>
          <form onSubmit={handleAddTask}>
            <TextField
              fullWidth
              label="What needs doing?"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="A bit of detail..."
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              type="date"
              value={newTask.due_date}
              onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" color="primary">
                Add to the List
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsAdding(false)}
              >
                Never Mind
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {!isAdding && filteredTasks.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setIsAdding(true)}
          >
            Add Task
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TaskList;
