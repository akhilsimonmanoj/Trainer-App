import React, { useState } from 'react'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import {Link} from 'react-router-dom'
import axios from '../config/axiosConfig'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/user/login', { email, password })
      const { user, token } = response.data // Assuming the backend sends both user and token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      setSuccess('Login successful')
      setError('')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      setSuccess('')
    }
  }
  

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth type="submit">
          Login
        </Button>
        <Typography>Dont have an account? <Link to='/register' style={{textDecoration: 'none'}}>Register</Link></Typography>
      </form>
    </Box>
  )
}

export default Login
