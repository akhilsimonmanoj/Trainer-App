import React, { useState, useEffect } from "react"
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography } from "@mui/material"
import axios from "../config/axiosConfig"

const AddOperation = () => {
  const [scheduledDate, setscheduledDate] = useState("")
  const [trainer, setTrainer] = useState("")
  const [opportunity, setOpportunity] = useState("")
  const [trainers, setTrainers] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  const [loadingOpportunities, setLoadingOpportunities] = useState(true)

  useEffect(() => {
    fetchTrainers()
    fetchOpportunities()
  }, [])

  const fetchTrainers = async () => {
    try {
      const response = await axios.get("/api/trainers")
      setTrainers(response.data)
    } catch (error) {
      console.error("Error fetching trainers:", error)
    } finally {
      setLoadingTrainers(false)
    }
  }

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get("/api/opportunities")
      setOpportunities(response.data)
    } catch (error) {
      console.error("Error fetching opportunities:", error)
    } finally {
      setLoadingOpportunities(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!scheduledDate || !trainer || !opportunity) {
      alert("Please fill in all fields before submitting.")
      return
    }

    try {
      await axios.post("/api/operations", { scheduledDate, trainer, opportunity })
      alert("Operation added successfully")
      setscheduledDate("")
      setTrainer("")
      setOpportunity("")
    } catch (error) {
      console.error("Error adding operation:", error)
      alert("Failed to add operation. Please try again.")
    }
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Add New Operation</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Session Date"
          type="date"
          fullWidth
          value={scheduledDate}
          onChange={(e) => setscheduledDate(e.target.value)}
          InputLabelProps={{ shrink: true }} // ✅ Fix label overlap
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Select Trainer</InputLabel>
          <Select value={trainer} onChange={(e) => setTrainer(e.target.value)}>
            {loadingTrainers ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              trainers.map((t) => (
                <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Select Opportunity</InputLabel>
          <Select value={opportunity} onChange={(e) => setOpportunity(e.target.value)}>
            {loadingOpportunities ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              opportunities.map((o) => (
                <MenuItem key={o._id} value={o._id}>{o.name}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Operation
        </Button>
      </form>
    </Box>
  )
}

export default AddOperation
