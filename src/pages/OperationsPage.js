import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import axios from 'axios';

const OperationsPage = ({ userRole }) => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    trainerId: '',
    sessionDate: '',
    sessionTime: '',
    sessionType: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchSessions = async () => {
    const response = await axios.get('/api/sessions');
    setSessions(response.data);
  };

  const handleOpen = (session = null) => {
    if (session) {
      setFormData(session);
      setEditId(session._id);
    } else {
      setFormData({
        trainerId: '',
        sessionDate: '',
        sessionTime: '',
        sessionType: '',
      });
      setEditId(null);
    }
  };

  const handleClose = () => {
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`/api/sessions/${editId}`, formData);
    } else {
      await axios.post('/api/sessions', formData);
    }
    fetchSessions();
    handleClose();
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Operations Management
      </Typography>

      {userRole === 'admin' && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ mb: 2 }}
        >
          Add Session
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trainer</TableCell>
              <TableCell>Session Date</TableCell>
              <TableCell>Session Time</TableCell>
              <TableCell>Session Type</TableCell>
              {userRole === 'admin' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session._id}>
                <TableCell>{session.trainerId}</TableCell>
                <TableCell>{session.sessionDate}</TableCell>
                <TableCell>{session.sessionTime}</TableCell>
                <TableCell>{session.sessionType}</TableCell>
                {userRole === 'admin' && (
                  <TableCell>
                    <Button onClick={() => handleOpen(session)}>Edit</Button>
                    <Button onClick={() => handleClose()} color="error">
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Operations */}
      <TextField
        label="Trainer ID"
        value={formData.trainerId}
        onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
      />
      <TextField
        label="Session Date"
        value={formData.sessionDate}
        onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
      />
      <TextField
        label="Session Time"
        value={formData.sessionTime}
        onChange={(e) => setFormData({ ...formData, sessionTime: e.target.value })}
      />
      <TextField
        label="Session Type"
        value={formData.sessionType}
        onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
      />
      <Button onClick={handleSubmit}>
        {editId ? 'Update Session' : 'Add Session'}
      </Button>
    </Box>
  );
};

export default OperationsPage;
