import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { apiHelper, endpoints } from '../../helpers';

const VendorUserManager = () => {
  const { user } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await apiHelper.get(endpoints.vendor.candidates(user.id));
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleInviteCandidate = async () => {
    try {
      await apiHelper.post(endpoints.vendor.inviteCandidate, {
        email: inviteEmail,
        vendorId: user.id
      });
      setInviteEmail('');
      setOpenInviteDialog(false);
      // Optionally refresh candidates list
      fetchCandidates();
    } catch (error) {
      console.error('Error inviting candidate:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Candidate Management</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpenInviteDialog(true)}
        >
          Invite Candidate
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Test Assigned</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.testName}</TableCell>
                <TableCell>
                  <Chip 
                    label={candidate.status}
                    color={getStatusColor(candidate.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{candidate.score || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {/* Handle view results */}}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invite Candidate Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
        <DialogTitle>Invite Candidate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Candidate Email"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Cancel</Button>
          <Button onClick={handleInviteCandidate} color="primary">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorUserManager; 