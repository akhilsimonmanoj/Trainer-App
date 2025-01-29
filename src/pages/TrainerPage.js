import React, { useEffect, useState } from 'react'
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
  Switch,
  FormControlLabel,
} from '@mui/material'
import axios from '../config/axiosConfig'

const TrainerPage = ({ user }) => {
  const userRole = user?.role
  const [trainers, setTrainers] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    availability: true,
    contactInfo: '',
    email: '',
  })
  const [editId, setEditId] = useState(null)

  // Fetch trainers on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get('/api/trainers')
        setTrainers(response.data)
      } catch (error) {
        console.error('Error fetching trainers:', error)
      }
    }

    fetchTrainers()
  }, [])

  const handleOpen = (trainer = null) => {
    if (trainer) {
      setEditId(trainer._id)
      setFormData({
        name: trainer.name,
        expertise: trainer.expertise.join(', '), // Convert array to comma-separated string
        availability: trainer.availability,
        contactInfo: trainer.contactInfo,
        email: trainer.user?.email || '',
      })
    } else {
      setFormData({ name: '', expertise: '', availability: true, contactInfo: '', email: '' })
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditId(null)
  }

  const handleSubmit = async () => {
    // Prepare data for submission
    const trainerData = {
      name: formData.name,
      expertise: formData.expertise.split(',').map((e) => e.trim()), // Convert string to array
      availability: formData.availability,
      contactInfo: formData.contactInfo,
      email: formData.email,
    }

    try {
      if (editId) {
        await axios.put(`/api/trainers/${editId}`, trainerData)
      } else {
        await axios.post('/api/trainers', trainerData)
      }
      const response = await axios.get('/api/trainers') // Refresh list
      setTrainers(response.data)
      handleClose()
    } catch (error) {
      console.error('Error saving trainer:', error.response?.data?.message || error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/trainers/${id}`)
      const response = await axios.get('/api/trainers') // Refresh list
      setTrainers(response.data)
    } catch (error) {
      console.error('Error deleting trainer:', error)
    }
  }

  const handleToggleAvailability = () => {
    // Toggle the availability value
    setFormData({ ...formData, availability: !formData.availability })
  }

  const handleTrainerAvailabilityToggle = async (id, newAvailability) => {
    try {
      // Update the trainer's availability in the database
      await axios.put(`/api/trainers/${id}`, { availability: newAvailability })
  
      // Update the trainer's availability in the local state
      setTrainers((prevTrainers) =>
        prevTrainers.map((trainer) =>
          trainer._id === id ? { ...trainer, availability: newAvailability } : trainer
        )
      )
    } catch (error) {
      console.error('Error updating trainer availability:', error.response?.data?.message || error.message)
    }
  }
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trainer Management
      </Typography>

      {userRole === 'Admin' && (
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>
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
              <TableCell>Contact Info</TableCell>
              {userRole === 'Admin' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer) => (
              <TableRow key={trainer._id}>
                <TableCell>{trainer.name}</TableCell>
                <TableCell>{trainer.user?.email || 'N/A'}</TableCell>
                <TableCell>{trainer.expertise.join(', ')}</TableCell>
                <TableCell>
                <Switch
                    checked={trainer.availability}
                    onChange={() => handleTrainerAvailabilityToggle(trainer._id, !trainer.availability)}
                    color="primary"
                />
                </TableCell>
                <TableCell>{trainer.contactInfo}</TableCell>
                {userRole === 'Admin' && (
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
            label="Contact Info"
            type='number'
            fullWidth
            margin="dense"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={editId !== null} // Disable email field when editing
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.availability}
                onChange={handleToggleAvailability} // Toggle the availability value
                color="primary"
              />
            }
            label={formData.availability ? 'Available' : 'Unavailable'} // Change label based on availability
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
  )
}

export default TrainerPage
