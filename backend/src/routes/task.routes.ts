import express from 'express';
import TaskModel from '../models/models';

const router = express.Router();

router.get('/tasks', async (_req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { title, description, due_date, completed } = req.body;
    const task = await TaskModel.create({ title, description, due_date, completed });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, due_date, completed } = req.body;
    const task = await TaskModel.update(id, { title, description, due_date, completed });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await TaskModel.delete(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
