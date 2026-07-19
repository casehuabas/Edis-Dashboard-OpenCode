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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import apiClient from '../services/api';

interface Voucher {
  id: number;
  ledger_id: number;
  description: string;
  amount: number;
  type: string;
  date: string;
  reference: string;
  created_at: string;
  ledger_name?: string;
}

interface Ledger {
  id: number;
  name: string;
  type: string;
  balance: number;
  description: string;
}

interface VoucherListProps {
  selectedLedger: Ledger | null;
  onBack: () => void;
}

const VoucherList: React.FC<VoucherListProps> = ({ selectedLedger, onBack }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [open, setOpen] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    ledger_id: selectedLedger?.id || 0,
    description: '',
    amount: 0,
    type: 'debit',
    date: new Date().toISOString().split('T')[0],
    reference: '',
  });

  useEffect(() => {
    fetchLedgers();
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [selectedLedger]);

  useEffect(() => {
    if (selectedLedger) {
      setNewVoucher(prev => ({ ...prev, ledger_id: selectedLedger.id }));
    }
  }, [selectedLedger]);

  const fetchVouchers = async () => {
    try {
      const params = selectedLedger ? `?ledger_id=${selectedLedger.id}` : '';
      const response = await apiClient.get(`/vouchers${params}`);
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  const fetchLedgers = async () => {
    try {
      const response = await apiClient.get('/ledgers');
      setLedgers(response.data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/vouchers', newVoucher);
      setNewVoucher({
        ledger_id: selectedLedger?.id || 0,
        description: '',
        amount: 0,
        type: 'debit',
        date: new Date().toISOString().split('T')[0],
        reference: '',
      });
      setOpen(false);
      fetchVouchers();
    } catch (error) {
      console.error('Error adding voucher:', error);
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    try {
      await apiClient.delete(`/vouchers/${id}`);
      setVouchers(vouchers.filter(v => v.id !== id));
    } catch (error) {
      console.error(`Error deleting voucher ${id}:`, error);
    }
  };

  const title = selectedLedger
    ? `Vouchers for ${selectedLedger.name}`
    : 'All Vouchers';

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedLedger && (
              <IconButton onClick={onBack} size="small" sx={{ color: '#4A7C2E' }}>
                <ArrowBack />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                color: '#3E2723',
              }}
            >
              {title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Voucher
          </Button>
        </Box>
      </Paper>

      {vouchers.length === 0 ? (
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
            No vouchers recorded...
          </Typography>
          <Typography variant="body2" sx={{ color: '#9E9488', mb: 3 }}>
            Every journey begins with a single entry.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Reference</TableCell>
                {!selectedLedger && <TableCell>Ledger</TableCell>}
                <TableCell sx={{ width: 60 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vouchers.map(voucher => (
                <TableRow
                  key={voucher.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(245, 230, 204, 0.4) !important',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#3E2723' }}>
                      {voucher.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: voucher.type === 'debit' ? '#2D4A1E' : '#8B3A3A',
                      }}
                    >
                      {voucher.type === 'debit' ? '+' : '−'}
                      {voucher.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={voucher.type}
                      size="small"
                      sx={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        backgroundColor: voucher.type === 'debit'
                          ? 'rgba(74, 124, 46, 0.15)'
                          : 'rgba(139, 58, 58, 0.15)',
                        color: voucher.type === 'debit' ? '#2D4A1E' : '#8B3A3A',
                        border: `1px solid ${
                          voucher.type === 'debit'
                            ? 'rgba(74, 124, 46, 0.3)'
                            : 'rgba(139, 58, 58, 0.3)'
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#6B6359' }}>
                      {voucher.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#6B6359' }}>
                      {voucher.reference || '—'}
                    </Typography>
                  </TableCell>
                  {!selectedLedger && (
                    <TableCell>
                      <Chip
                        label={voucher.ledger_name || `Ledger #${voucher.ledger_id}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontSize: '0.7rem',
                          borderColor: '#C4A882',
                          color: '#6B4423',
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteVoucher(voucher.id)}
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          A New Voucher Entry
        </DialogTitle>
        <form onSubmit={handleAddVoucher}>
          <DialogContent>
            <TextField
              fullWidth
              label="Description"
              value={newVoucher.description}
              onChange={e => setNewVoucher({ ...newVoucher, description: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Ledger</InputLabel>
              <Select
                value={newVoucher.ledger_id}
                label="Ledger"
                onChange={e => setNewVoucher({ ...newVoucher, ledger_id: e.target.value as number })}
                required
              >
                {ledgers.map(l => (
                  <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newVoucher.type}
                label="Type"
                onChange={e => setNewVoucher({ ...newVoucher, type: e.target.value })}
              >
                <MenuItem value="debit">Debit (adds to ledger)</MenuItem>
                <MenuItem value="credit">Credit (subtracts from ledger)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={newVoucher.amount}
              onChange={e => setNewVoucher({ ...newVoucher, amount: parseFloat(e.target.value) || 0 })}
              margin="normal"
              required
              slotProps={{ htmlInput: { step: '0.01', min: 0 } }}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={newVoucher.date}
              onChange={e => setNewVoucher({ ...newVoucher, date: e.target.value })}
              margin="normal"
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              label="Reference (optional)"
              value={newVoucher.reference}
              onChange={e => setNewVoucher({ ...newVoucher, reference: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Voucher
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default VoucherList;
