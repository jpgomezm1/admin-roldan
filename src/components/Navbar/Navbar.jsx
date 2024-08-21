import React, { useState } from 'react';
import {
  Box, Button, Drawer, IconButton, List, ListItem, ListItemIcon,
  Modal, Typography, useMediaQuery, useTheme, ListItemText, Divider, Tooltip
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login'; 
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import InventoryIcon from '@mui/icons-material/Inventory';

import LoginForm from '../LoginForm/LoginForm'; 
import logo from '../../assets/logo33.png';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice'; 

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { pathname } = useLocation();  // Para identificar la ruta actual

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up('sm'));
  
  const navItems = [
    { to: "/orders", icon: <DeliveryDiningIcon />, text: "Órdenes" },
    { to: "/products", icon: <AddShoppingCartIcon />, text: "Productos" },
    { to: "/stock", icon: <FastfoodIcon />, text: "Inventarios" },
    { to: "/clients", icon: <EmojiPeopleIcon />, text: "Comercial" },
    { to: "/cartera", icon: <CurrencyExchangeIcon />, text: "Cartera" },
    { to: "/bodega", icon: <InventoryIcon />, text: "Bodega" },
    { to: "/gastos", icon: <PaymentIcon />, text: "Gastos Operación" },
    { to: "/data", icon: <WaterfallChartIcon />, text: "Data" },        
    { to: "/params", icon: <SettingsIcon />, text: "Parámetros" },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 1 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ marginRight: 2, marginLeft: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        variant={isMatch ? "permanent" : "temporary"}
        open={isMatch ? true : drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          width: isMatch ? 240 : 'auto',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isMatch ? 240 : 'auto',
            boxSizing: 'border-box',
            padding: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Link to="/" onClick={handleDrawerClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src={logo} alt="Logo" width="170" />  
            </Box>
          </Link>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map(item => (
              <Tooltip title={item.text} key={item.text} placement="right" arrow>
                <ListItem
                  button
                  component={Link}
                  to={item.to}
                  sx={{
                    justifyContent: 'flex-start',
                    my: 1.5,
                    px: 2,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    '&:active': { transform: 'scale(0.98)' },
                    backgroundColor: pathname === item.to ? '#d7d7f7' : 'transparent',
                  }}
                  onClick={handleDrawerClose}
                >
                  <ListItemIcon sx={{ minWidth: '45px', color: '#333' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#333' }}>
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
  
        <Box sx={{ mt: 2.5 }}>
          <Button
            startIcon={isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
            onClick={isAuthenticated ? handleLogout : handleLoginOpen}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#5E55FE',
              '&:hover': { backgroundColor: '#7b45a1' },
              color: 'white',
              fontFamily: 'Poppins',
              borderRadius: '10px',
              textTransform: 'none',
              padding: '10px 7px',
              fontSize: '17px',
              marginTop: '7px',
              marginBottom: '5px',
              fontWeight: 'bold',
              boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </Button>
        </Box>
      </Drawer>
      <Modal open={loginOpen} onClose={handleLoginClose}>
        <LoginForm handleClose={handleLoginClose} />
      </Modal>
    </Box>
  );
};

export default Navbar;
