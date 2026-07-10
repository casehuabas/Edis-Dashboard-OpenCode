import pool from '../config/db';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
}

class TaskModel {
  static async find(): Promise<Task[]> {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    return result.rows;
  }

  static async create(task: Omit<Task, 'id'>): Promise<Task> {
    const { title, description, due_date, completed } = task;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date, completed) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, due_date, completed]
    );
    return result.rows[0];
  }

  static async update(id: number, task: Partial<Omit<Task, 'id'>>): Promise<Task | null> {
    const { title, description, due_date, completed } = task;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE id = $5 RETURNING *',
      [title, description, due_date, completed, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default TaskModel;
