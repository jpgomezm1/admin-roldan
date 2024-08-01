import React, { useState } from 'react';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemIcon, Modal, Typography, useMediaQuery, useTheme, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
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

import logo from '../../assets/logo33.png'

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice'; 

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);  // Obteniendo el estado de autenticación

  const handleLogout = () => {
    dispatch(logout());  // Al hacer clic en el botón, se despacha la acción de cierre de sesión
  };

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up('sm'));  // Verifica si el ancho de pantalla es igual o mayor al punto de interrupción 'sm'
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ marginRight: 2, marginLeft: 1 }}  // Agregando margen izquierdo para un mejor aspecto visual
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        variant={isMatch ? "permanent" : "temporary"}  // Si el ancho de pantalla es mayor que 'sm', el comportamiento de la barra de navegación será 'permanent', de lo contrario será 'temporary'
        open={isMatch ? true : drawerOpen}  // Si es 'temporary', controla la apertura y cierre de la barra de navegación con el estado 'drawerOpen'
        onClose={handleDrawerClose}  // Para 'temporary', necesitamos un manejador para cerrar la barra de navegación
        sx={{
          width: isMatch ? 240 : 'auto',  // Si es 'permanent', la barra de navegación tiene un ancho fijo, de lo contrario el ancho es automático
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: isMatch ? 240 : 'auto',  // Asegurarse de que el ancho del papel es el mismo que el del contenedor
            boxSizing: 'border-box', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Poppins, sans-serif'
          },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Link to="/" onClick={handleDrawerClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
              <img src={logo} alt="Logo" width="170" />  
            </Box>
          </Link>
          <List>
            {[
              { to: "/orders", icon: <DeliveryDiningIcon />, text: "Ordenes" },
              { to: "/products", icon: <AddShoppingCartIcon />, text: "Productos" },
              { to: "/stock", icon: <FastfoodIcon />, text: "Stock de Productos" },
              { to: "/clients", icon: <EmojiPeopleIcon />, text: "Comercial" },
              { to: "/cartera", icon: <CurrencyExchangeIcon />, text: "Cartera" },
              { to: "/bodega", icon: <InventoryIcon />, text: "Bodega" },
              { to: "/gastos", icon: <PaymentIcon />, text: "Gastos Operacion" },
              { to: "/data", icon: <WaterfallChartIcon />, text: "Data" },        
              { to: "/params", icon: <SettingsIcon />, text: "Parametros" },
              { to: "/soporte", icon: <SupportAgentIcon />, text: "Soporte" },
            ].map(item => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.to} 
                sx={{ justifyContent: 'flex-start', my: 2, '&:hover': { backgroundColor: "#e0e0e0" } }}
                onClick={handleDrawerClose}  // Aquí añadimos el manejador para cerrar el Drawer
              >
                <ListItemIcon sx={{ minWidth: '45px', color: '#333' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#333' }}>
                    {item.text}
                  </Typography>
                } />
              </ListItem>
            ))}
          </List>
        </Box>
  
        <Box sx={{ mt: 2.5 }}>
          <Button
            startIcon={isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
            onClick={isAuthenticated ? handleLogout : handleLoginOpen}
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#5E55FE', '&:hover': { backgroundColor: '#7b45a1' }, color: 'white', fontFamily: 'Poppins', borderRadius: '10px', textTransform: 'none', padding: '10px 7px', fontSize: '17px', marginTop: '7px', marginBottom: '5px', marginLeft: '7px', fontWeight: 'bold' }}
          >
            {isAuthenticated ? 'Cerrar Sesion' : 'Iniciar Sesion'}
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

