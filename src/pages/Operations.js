import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material"
import axios from "../config/axiosConfig"

const Operations = () => {
  const [operations, setOperations] = useState([])
  const [trainers, setTrainers] = useState([])
  const [selectedTrainer, setSelectedTrainer] = useState({})
  const [selectedPerformance, setSelectedPerformance] = useState({})
  const [selectedStatus, setSelectedStatus] = useState({}) // ✅ New State for Status
  const [editMode, setEditMode] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOperations()
    fetchTrainers()
  }, [])

  const fetchOperations = async () => {
    try {
      const response = await axios.get("/api/operations")
      setOperations(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching operations:", error)
    }
  }

  const fetchTrainers = async () => {
    try {
      const response = await axios.get("/api/trainers")
      setTrainers(response.data)
    } catch (error) {
      console.error("Error fetching trainers:", error)
    }
  }

  const handleUpdate = async (operationId, currentTrainer, currentPerformance, currentStatus) => {
    const trainerId = selectedTrainer[operationId] || currentTrainer
    const performance = selectedPerformance[operationId] || currentPerformance
    const status = selectedStatus[operationId] || currentStatus // ✅ Capture Status
    try {
      const response = await axios.put(`/api/operations/${operationId}`, { 
        trainer: trainerId, 
        performance,
        status, // ✅ Send Status to Backend
      })
      fetchOperations() // Refresh Data
      setEditMode({ ...editMode, [operationId]: false })
    } catch (error) {
      console.error("Error updating operation:", error)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <h2>Operations Management</h2>
      {loading && <p>Loading operations...</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session Date</TableCell>
              <TableCell>Trainer</TableCell>
              <TableCell>Opportunity</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Status</TableCell> {/* ✅ New Column */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation._id}>
                <TableCell>{new Date(operation.scheduledDate).toDateString()}</TableCell>

                {/* Trainer Selection */}
                <TableCell>
                  {editMode[operation._id] ? (
                    <FormControl sx={{ minWidth: 150, ml: 2 }}>
                      <Select
                        value={selectedTrainer[operation._id] || operation.trainer?._id || ""}
                        onChange={(e) =>
                          setSelectedTrainer({ ...selectedTrainer, [operation._id]: e.target.value })
                        }
                      >
                        {trainers.map((trainer) => (
                          <MenuItem key={trainer._id} value={trainer._id}>
                            {trainer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    operation.trainer?.name || "Not Assigned"
                  )}
                </TableCell>

                {/* Opportunity Name */}
                <TableCell>{operation.opportunity.name}</TableCell>

                {/* Performance Selection */}
                <TableCell>
                  {editMode[operation._id] ? (
                    <FormControl sx={{ minWidth: 150 }}>
                      <Select
                        value={selectedPerformance[operation._id] || operation.performance}
                        onChange={(e) =>
                          setSelectedPerformance({ ...selectedPerformance, [operation._id]: e.target.value })
                        }
                      >
                        <MenuItem value="Excellent">Excellent</MenuItem>
                        <MenuItem value="Good">Good</MenuItem>
                        <MenuItem value="Needs Improvement">Needs Improvement</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    operation.performance
                  )}
                </TableCell>

                {/* ✅ Status Selection */}
                <TableCell>
                  {editMode[operation._id] ? (
                    <FormControl sx={{ minWidth: 150 }}>
                      <Select
                        value={selectedStatus[operation._id] || operation.status}
                        onChange={(e) =>
                          setSelectedStatus({ ...selectedStatus, [operation._id]: e.target.value })
                        }
                      >
                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    operation.status
                  )}
                </TableCell>

                {/* Edit & Update Buttons */}
                <TableCell>
                  {editMode[operation._id] ? (
                    <>
                      <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => 
                          handleUpdate(
                            operation._id, 
                            operation.trainer?._id, 
                            operation.performance, 
                            operation.status // ✅ Send Status
                          )
                        }
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setEditMode({ ...editMode, [operation._id]: false })}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setEditMode({ ...editMode, [operation._id]: true })}
                    >
                      Edit
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

export default Operations
