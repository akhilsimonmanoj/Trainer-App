import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';

const OpportunitiesPage = ({ userRole }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    description: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchOpportunities = async () => {
    const response = await axios.get('/api/opportunities');
    setOpportunities(response.data);
  };

  const handleOpen = (opportunity = null) => {
    if (opportunity) {
      setFormData(opportunity);
      setEditId(opportunity._id);
    } else {
      setFormData({ title: '', type: '', location: '', description: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`/api/opportunities/${editId}`, formData);
    } else {
      await axios.post('/api/opportunities', formData);
    }
    fetchOpportunities();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/opportunities/${id}`);
    fetchOpportunities();
  };

  const handleExpressInterest = async (id) => {
    await axios.put(`/api/opportunities/${id}/express-interest`, {
      trainerId: 'trainer_id_here', // Replace with actual trainer ID
    });
    fetchOpportunities();
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Opportunities Management
      </Typography>

      {userRole === 'admin' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Opportunity
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              {userRole === 'admin' && <TableCell>Actions</TableCell>}
              {userRole === 'trainer' && <TableCell>Express Interest</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity._id}>
                <TableCell>{opportunity.title}</TableCell>
                <TableCell>{opportunity.type}</TableCell>
                <TableCell>{opportunity.location}</TableCell>
                <TableCell>{opportunity.description}</TableCell>
                {userRole === 'admin' && (
                  <TableCell>
                    <Button onClick={() => handleOpen(opportunity)}>Edit</Button>
                    <Button onClick={() => handleDelete(opportunity._id)} color="error">
                      Delete
                    </Button>
                  </TableCell>
                )}
                {userRole === 'trainer' && (
                  <TableCell>
                    <Button onClick={() => handleExpressInterest(opportunity._id)}>
                      Express Interest
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Opportunity */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Opportunity' : 'Add Opportunity'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Type"
            fullWidth
            margin="dense"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            margin="dense"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpportunitiesPage;
