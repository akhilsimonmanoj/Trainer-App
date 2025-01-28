import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleNavigation('/trainer')}>
          Add Trainers
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/opportunities')}>
          Opportunities
        </MenuItem>
        <MenuItem onClick={() => handleNavigation('/operations')}>
          Operations
        </MenuItem>
      </Menu>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Trainer Management Dashboard
        </Typography>
        <Typography>
          Select an option from the toolbar to manage trainers, opportunities,
          or operations.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
