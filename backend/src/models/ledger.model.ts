import pool from '../config/db';

interface Ledger {
  id: number;
  name: string;
  type: string;
  balance: number;
  description: string;
  created_at: string;
  updated_at: string;
}

class LedgerModel {
  static async find(): Promise<Ledger[]> {
    const result = await pool.query('SELECT * FROM ledgers ORDER BY id DESC');
    return result.rows;
  }

  static async findOne(id: number): Promise<Ledger | null> {
    const result = await pool.query('SELECT * FROM ledgers WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(ledger: Omit<Ledger, 'id' | 'created_at' | 'updated_at'>): Promise<Ledger> {
    const { name, type, balance, description } = ledger;
    const result = await pool.query(
      `INSERT INTO ledgers (name, type, balance, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type, balance ?? 0, description]
    );
    return result.rows[0];
  }

  static async update(id: number, ledger: Partial<Omit<Ledger, 'id' | 'created_at' | 'updated_at'>>): Promise<Ledger | null> {
    const { name, type, balance, description } = ledger;
    const result = await pool.query(
      `UPDATE ledgers
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           balance = COALESCE($3, balance),
           description = COALESCE($4, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [name, type, balance, description, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM ledgers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default LedgerModel;
