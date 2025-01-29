import React, { useState, useEffect } from 'react'
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import axios from '../config/axiosConfig'

const OpportunitiesPage = ({ user }) => {

  const [opportunities, setOpportunities] = useState([])
  const [filteredOpportunities, setFilteredOpportunities] = useState([])
  const [filter, setFilter] = useState({ type: '', location: '' })

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    filterOpportunities()
  }, [filter, opportunities])

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('/api/opportunities')
      setOpportunities(response.data)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    }
  }

  const filterOpportunities = () => {
    const filtered = opportunities.filter(opportunity => {
      return (
        (filter.type === '' || opportunity.type === filter.type) &&
        (filter.location === '' || opportunity.location === filter.location)
      )
    })
    setFilteredOpportunities(filtered)
  }

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    })
  }

  const handleExpressInterest = async (id, opportunityType) => {
    const userId = user.id  // Get user ID from the context or state

    const interestData = {
      userId: userId,  // The user expressing interest
      interestType: opportunityType,  // The type of interest based on the opportunity type
    }

    try {
      // Send the user's ID to be added to the trainersInterested array while keeping status "Open" for others
      const response = await axios.put(`/api/opportunities/${id}/interest`, interestData)

      // Update local state to reflect the change
      const updatedOpportunities = opportunities.map((opportunity) =>
        opportunity._id === id
          ? { 
              ...opportunity, 
              trainersInterested: [...opportunity.trainersInterested, userId], 
              
            }
          : opportunity
      )
      setOpportunities(updatedOpportunities)

    } catch (error) {
      if (error.message) {
        alert('You have already expressed Interest')
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
        Training Opportunities
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filter.type}
            onChange={handleFilterChange}
            name="type"
            label="Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Soft Skills">Soft Skills</MenuItem>
            <MenuItem value="Leadership">Leadership</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filter.location}
            onChange={handleFilterChange}
            name="location"
            label="Location"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="On-site">On-site</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOpportunities.map((opportunity) => (
              <TableRow key={opportunity._id}>
                <TableCell>{opportunity.name}</TableCell>
                <TableCell>{opportunity.type}</TableCell>
                <TableCell>{opportunity.location}</TableCell>
                <TableCell>{opportunity.status}</TableCell>
                <TableCell>
                  {((user.role === 'Trainer' || user.role === 'Admin') &&
                    !opportunity.trainersInterested.includes(user.id)) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleExpressInterest(opportunity._id, opportunity.type)}
                        disabled={opportunity.trainersInterested.includes(user.id)}
                      >
                        {opportunity.trainersInterested.includes(user.id)
                          ? 'Already Interested'
                          : 'Express Interest'}
                      </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default OpportunitiesPage
