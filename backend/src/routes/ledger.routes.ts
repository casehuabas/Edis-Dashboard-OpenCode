import express from 'express';
import LedgerModel from '../models/ledger.model';

const router = express.Router();

router.get('/ledgers', async (_req, res) => {
  try {
    const ledgers = await LedgerModel.find();
    res.status(200).json(ledgers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ledgers' });
  }
});

router.post('/ledgers', async (req, res) => {
  try {
    const { name, type, balance, description } = req.body;
    const ledger = await LedgerModel.create({ name, type, balance, description });
    res.status(201).json(ledger);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ledger' });
  }
});

router.put('/ledgers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, balance, description } = req.body;
    const ledger = await LedgerModel.update(id, { name, type, balance, description });
    if (ledger) {
      res.status(200).json(ledger);
    } else {
      res.status(404).json({ error: 'Ledger not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update ledger' });
  }
});

router.delete('/ledgers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await LedgerModel.delete(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Ledger not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete ledger' });
  }
});

export default router;
