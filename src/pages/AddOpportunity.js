import React, { useState } from 'react'
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import axios from '../config/axiosConfig'


const AddOpportunityPage = () => {
  const [opportunity, setOpportunity] = useState({
    name: '',
    type: '',
    location: '',
    status: 'Open'
  })

  const handleChange = (e) => {
    setOpportunity({
      ...opportunity,
      [e.target.name]: e.target.value
    })
  }

const handleSubmit = async (e) => {
    e.preventDefault()  
    try {
      const response = await axios.post('/api/opportunities', opportunity)
      alert('Opportunity added successfully!')
      setOpportunity({ name: '', type: '', location: '', status: 'Open' })
    } catch (error) {
      // Log the entire error object to understand why the request failed
      if (error.response) {
        console.error('Backend error response:', error.response.data)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error setting up request:', error.message)
      }
    }
  }
  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Opportunity
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="name"
          value={opportunity.title}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            value={opportunity.type}
            onChange={handleChange}
            name="type"
            label="Type"
          >
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Soft Skills">Soft Skills</MenuItem>
            <MenuItem value="Leadership">Leadership</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Location</InputLabel>
          <Select
            value={opportunity.location}
            onChange={handleChange}
            name="location"
            label="Location"
          >
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="On-site">On-site</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Opportunity
        </Button>
      </form>
    </Box>
  )
}

export default AddOpportunityPage
