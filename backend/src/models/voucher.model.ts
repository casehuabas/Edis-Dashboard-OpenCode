import pool from '../config/db';

interface Voucher {
  id: number;
  ledger_id: number;
  description: string;
  amount: number;
  type: string; // 'debit' or 'credit'
  date: string;
  reference: string;
  created_at: string;
  ledger_name?: string;
}

/**
 * Adjust the referenced ledger's balance.
 * For a debit: balance increases (money comes in).
 * For a credit: balance decreases (money goes out).
 */
async function adjustLedgerBalance(ledgerId: number, amount: number, type: 'debit' | 'credit', sign: 1 | -1): Promise<void> {
  // sign = +1 to apply the original effect, -1 to reverse
  const delta = type === 'debit' ? amount : -amount;
  await pool.query(
    'UPDATE ledgers SET balance = balance + ($1), updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [delta * sign, ledgerId]
  );
}

class VoucherModel {
  /**
   * Retrieve vouchers, optionally filtered by ledger.
   * Joins ledger name for display.
   */
  static async find(ledgerId?: number): Promise<Voucher[]> {
    let query = `
      SELECT v.*, l.name AS ledger_name
      FROM vouchers v
      LEFT JOIN ledgers l ON v.ledger_id = l.id
    `;
    const params: number[] = [];
    if (ledgerId) {
      query += ' WHERE v.ledger_id = $1';
      params.push(ledgerId);
    }
    query += ' ORDER BY v.date DESC, v.id DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findByLedger(ledgerId: number): Promise<Voucher[]> {
    return VoucherModel.find(ledgerId);
  }

  static async create(voucher: Omit<Voucher, 'id' | 'created_at' | 'ledger_name'>): Promise<Voucher> {
    const { ledger_id, description, amount, type, date, reference } = voucher;

    const result = await pool.query(
      `INSERT INTO vouchers (ledger_id, description, amount, type, date, reference)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [ledger_id, description, amount, type, date, reference]
    );

    // Apply balance effect
    await adjustLedgerBalance(ledger_id, amount, type as 'debit' | 'credit', 1);

    return result.rows[0];
  }

  static async update(id: number, voucher: Partial<Omit<Voucher, 'id' | 'created_at' | 'ledger_name'>>): Promise<Voucher | null> {
    // Fetch old voucher
    const oldResult = await pool.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) return null;
    const old = oldResult.rows[0];

    // Undo old balance effect
    await adjustLedgerBalance(old.ledger_id, parseFloat(old.amount), old.type as 'debit' | 'credit', -1);

    const ledger_id = voucher.ledger_id ?? old.ledger_id;
    const description = voucher.description ?? old.description;
    const amount = voucher.amount ?? parseFloat(old.amount);
    const type = voucher.type ?? old.type;
    const date = voucher.date ?? old.date;
    const reference = voucher.reference ?? old.reference;

    // Apply new balance effect
    await adjustLedgerBalance(ledger_id, amount, type as 'debit' | 'credit', 1);

    const result = await pool.query(
      `UPDATE vouchers
       SET ledger_id = $1, description = $2, amount = $3,
           type = $4, date = $5, reference = $6
       WHERE id = $7 RETURNING *`,
      [ledger_id, description, amount, type, date, reference, id]
    );

    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const oldResult = await pool.query('SELECT * FROM vouchers WHERE id = $1', [id]);
    if (oldResult.rows.length === 0) return false;
    const voucher = oldResult.rows[0];

    // Reverse balance effect
    await adjustLedgerBalance(voucher.ledger_id, parseFloat(voucher.amount), voucher.type as 'debit' | 'credit', -1);

    const result = await pool.query('DELETE FROM vouchers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export default VoucherModel;
