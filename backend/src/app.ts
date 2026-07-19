import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../database/.env') });

import express from 'express';
import cors from 'cors';
import taskRouter from './routes/task.routes';
import ledgerRouter from './routes/ledger.routes';
import voucherRouter from './routes/voucher.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', taskRouter);
app.use('/api', ledgerRouter);
app.use('/api', voucherRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
