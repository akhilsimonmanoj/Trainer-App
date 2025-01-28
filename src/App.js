import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import TrainerPage from './pages/TrainerPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OperationsPage from './pages/OperationsPage';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [userRole, setUserRole] = useState(null); // This will store the role of the logged-in user
  const [user, setUser] = useState(null); // This stores the logged-in user

  useEffect(() => {
    // Check user authentication and role on initial load (from localStorage or API)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
      setUserRole(storedUser.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* Centralized AppBar */}
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Trainer Management App
              </Typography>
              {user ? (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/trainer">
                    Trainer
                  </Button>
                  <Button color="inherit" component={Link} to="/opportunities">
                    Opportunities
                  </Button>
                  {userRole === 'admin' && (
                    <Button color="inherit" component={Link} to="/operations">
                      Operations
                    </Button>
                  )}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              padding: 3,
              marginTop: 8, // Add margin to account for the fixed AppBar height
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/opportunities" element={<OpportunitiesPage userRole={userRole} />} />
              <Route path="/operations" element={<OperationsPage userRole={userRole} />} />
              <Route path="/trainer" element={<TrainerPage user={user} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
