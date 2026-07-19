import express from 'express';
import VoucherModel from '../models/voucher.model';

const router = express.Router();

router.get('/vouchers', async (req, res) => {
  try {
    const ledgerId = req.query.ledger_id ? parseInt(req.query.ledger_id as string) : undefined;
    const vouchers = await VoucherModel.find(ledgerId);
    res.status(200).json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
  }
});

router.post('/vouchers', async (req, res) => {
  try {
    const { ledger_id, description, amount, type, date, reference } = req.body;
    const voucher = await VoucherModel.create({ ledger_id, description, amount, type, date, reference });
    res.status(201).json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create voucher' });
  }
});

router.put('/vouchers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { ledger_id, description, amount, type, date, reference } = req.body;
    const voucher = await VoucherModel.update(id, { ledger_id, description, amount, type, date, reference });
    if (voucher) {
      res.status(200).json(voucher);
    } else {
      res.status(404).json({ error: 'Voucher not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update voucher' });
  }
});

router.delete('/vouchers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await VoucherModel.delete(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Voucher not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete voucher' });
  }
});

export default router;
