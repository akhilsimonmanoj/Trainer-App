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
import axios from '../config/axiosConfig';

const TrainerPage = ({ user }) => {
  const userRole = JSON.parse(user);
  console.log({ userRole: userRole.role });
  const [trainers, setTrainers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    availability: '',
    contact: '',
    email: '', // Add email to the form data
  });
  const [editId, setEditId] = useState(null);

  const fetchTrainers = async () => {
    const response = await axios.get('/api/trainers');
    console.log(response.data);
    setTrainers(response.data);
  };

  const handleOpen = async (trainer = null) => {
    if (trainer) {
      const response = await axios.get(`/api/users/${trainer.user}`); // Fetch user data based on user ObjectId
      setFormData({
        name: trainer.name,
        expertise: trainer.expertise,
        availability: trainer.availability,
        contact: trainer.contact,
        email: response.data.user.email, // Set the email fetched from User model
      });
      setEditId(trainer._id);
    } else {
      setFormData({ name: '', expertise: '', availability: '', contact: '', email: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const trainerData = {
      name: formData.name,
      expertise: formData.expertise,
      contact: formData.contact,
      availability: formData.availability,
      user: formData.email, // Use the email to get the user ObjectId or send email to create the user
    };

    if (editId) {
      await axios.put(`/api/trainers/${editId}`, trainerData);
    } else {
      await axios.post('/api/trainers', trainerData);
    }
    fetchTrainers();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/trainers/${id}`);
    fetchTrainers();
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trainer Management
      </Typography>

      {userRole?.role === 'Admin' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Add Trainer
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Expertise</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Contact</TableCell>
              {userRole?.role === 'Admin' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer) => (
              <TableRow key={trainer._id}>
                <TableCell>{trainer.name}</TableCell>
                <TableCell>{trainer.user.email}</TableCell>
                <TableCell>{trainer.expertise + ", "}</TableCell>
                <TableCell>{trainer.availability ? 'Available' : 'Unavailable'}</TableCell>
                <TableCell>{trainer.contactInfo}</TableCell>
                {userRole?.role === 'Admin' && (
                  <TableCell>
                    <Button onClick={() => handleOpen(trainer)}>Edit</Button>
                    <Button onClick={() => handleDelete(trainer._id)} color="error">
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Trainer' : 'Add Trainer'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Expertise"
            fullWidth
            margin="dense"
            value={formData.expertise}
            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          />
          <TextField
            label="Availability"
            fullWidth
            margin="dense"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />
          <TextField
            label="Contact"
            fullWidth
            margin="dense"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={editId !== null} // Disable email field if editing an existing trainer
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

export default TrainerPage;
