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
import { Add, Delete, Visibility } from '@mui/icons-material';
import apiClient from '../services/api';

interface Ledger {
  id: number;
  name: string;
  type: string;
  balance: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface LedgerListProps {
  onSelectLedger: (ledger: Ledger) => void;
}

const LedgerList: React.FC<LedgerListProps> = ({ onSelectLedger }) => {
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [open, setOpen] = useState(false);
  const [newLedger, setNewLedger] = useState({
    name: '',
    type: 'asset',
    balance: 0,
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    try {
      const response = await apiClient.get('/ledgers');
      setLedgers(response.data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const handleAddLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/ledgers', newLedger);
      setNewLedger({ name: '', type: 'asset', balance: 0, description: '' });
      setOpen(false);
      fetchLedgers();
    } catch (error) {
      console.error('Error adding ledger:', error);
    }
  };

  const handleDeleteLedger = async (id: number) => {
    try {
      await apiClient.delete(`/ledgers/${id}`);
      setLedgers(ledgers.filter(l => l.id !== id));
    } catch (error) {
      console.error(`Error deleting ledger ${id}:`, error);
    }
  };

  const filteredLedgers = ledgers.filter(ledger =>
    ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ledger.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ledger.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeColors: Record<string, string> = {
    income: '#4A7C2E',
    expense: '#8B3A3A',
    asset: '#2D4A1E',
    liability: '#6B4423',
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search ledgers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Ledger
          </Button>
        </Box>
      </Paper>

      {filteredLedgers.length === 0 ? (
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
            The coffers are empty...
          </Typography>
          <Typography variant="body2" sx={{ color: '#9E9488', mb: 3 }}>
            No ledgers here yet. Time to open an account!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Description</TableCell>
                <TableCell sx={{ width: 120 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLedgers.map(ledger => (
                <TableRow
                  key={ledger.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 230, 204, 0.4) !important',
                    },
                  }}
                  onClick={() => onSelectLedger(ledger)}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#3E2723' }}
                    >
                      {ledger.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ledger.type}
                      size="small"
                      sx={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        backgroundColor: `${typeColors[ledger.type] || '#6B6359'}22`,
                        color: typeColors[ledger.type] || '#6B6359',
                        border: `1px solid ${typeColors[ledger.type] || '#6B6359'}44`,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: ledger.balance >= 0 ? '#2D4A1E' : '#8B3A3A',
                      }}
                    >
                      {ledger.balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: '#6B6359', fontStyle: ledger.description ? 'normal' : 'italic' }}
                    >
                      {ledger.description || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#4A7C2E' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLedger(ledger);
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#8B3A3A' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLedger(ledger.id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          A New Ledger, Precious
        </DialogTitle>
        <form onSubmit={handleAddLedger}>
          <DialogContent>
            <TextField
              fullWidth
              label="Ledger Name"
              value={newLedger.name}
              onChange={e => setNewLedger({ ...newLedger, name: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newLedger.type}
                label="Type"
                onChange={e => setNewLedger({ ...newLedger, type: e.target.value })}
              >
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="liability">Liability</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Starting Balance"
              type="number"
              value={newLedger.balance}
              onChange={e => setNewLedger({ ...newLedger, balance: parseFloat(e.target.value) || 0 })}
              margin="normal"
              slotProps={{ htmlInput: { step: '0.01' } }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newLedger.description}
              onChange={e => setNewLedger({ ...newLedger, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Never Mind
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Ledger
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default LedgerList;
