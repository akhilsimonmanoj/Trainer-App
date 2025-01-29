import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import OpportunitiesPage from './pages/OpportunitiesPage'
import AddOpportunity from './pages/AddOpportunity' 
import TrainerPage from './pages/TrainerPage'
import OperationsPage from './pages/Operations'
import AddOperation from './pages/AddOperation'

const App = () => {
  const [userRole, setUserRole] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    console.log("Stored user from localStorage:", storedUser) // Debugging line
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) // Ensure it's parsed into an object
      console.log("user:", parsedUser) // Debugging line
      setUser(parsedUser) // Set the user state
      setUserRole(parsedUser.role) // Set the role state
    }
  }, [])
  

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Trainer Management App
              </Typography>
              {user ? (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                  <Button color="inherit" component={Link} to="/trainer">Trainer</Button>
                  <Button color="inherit" component={Link} to="/opportunities">Opportunities</Button>
                  {user.role === 'Admin' && (
                    <Button color="inherit" component={Link} to="/add-opportunity">Add Opportunity</Button>
                  )}
                  {user.role === 'Admin' && (
                    <Button color="inherit" component={Link} to="/operations">Operations</Button>
                  )}
                  {user.role === 'Admin' && (
                     <Button color="inherit" component={Link} to="/add-operation">Add Operation</Button>
                  )}
                 
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">Login</Button>
                  <Button color="inherit" component={Link} to="/register">Register</Button>
                </>
              )}
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1, padding: 3, marginTop: 8 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/opportunities" element={<OpportunitiesPage user={user} />} />
              <Route path="/add-opportunity" element={<AddOpportunity />} />
              <Route path="/trainer" element={<TrainerPage user={user} />} />
              <Route path="/operations" element={<OperationsPage user={user} />} />
              <Route path="/add-operation" element={<AddOperation />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  )
}

export default App
