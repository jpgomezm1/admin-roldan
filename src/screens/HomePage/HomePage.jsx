import React from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery, useTheme, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoDeveloper from '../../assets/logo33.png';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';

function HomePage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const logo_url = useSelector(state => state.auth.logo_url);
  const establecimiento = useSelector(state => state.auth.establecimiento);

  // Función para capitalizar cada palabra
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src={logo_url} alt="Logo del cliente" width={isSmallScreen ? '150' : '250'} />
        {establecimiento && (
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: '#5E55FE' }}>
            {capitalizeWords(establecimiento)}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#5E55FE' }}>
          Bienvenido a Zeendr
        </Typography>
        <Typography variant="h6" gutterBottom>
        Gestiona de manera integral tu negocio con nuestra plataforma. Controla y optimiza tus pedidos, maneja eficientemente tu cartera, ordenes, ventas, bodega e inventarios. Toda la operación y la información financiera de tu empresa en un solo lugar.
        </Typography>
      </Box>
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          Funciones principales
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: "Ordenes", desc: "Visualice todos sus pedidos a domicilio en tiempo real", link: '/orders', icon: <DeliveryDiningIcon /> },
            { title: "Productos", desc: "Añade y elimina productos para que tus clientes ordenen", link: '/products', icon: <AddShoppingCartIcon /> },
            { title: "Stock Productos", desc: "Controle los inventarios de sus productos y sus ventas", link: '/stock', icon: <FastfoodIcon /> },
            { title: "Clientes", desc: "Conozca y entienda a sus clientes para vender más", link: '/clients', icon: <EmojiPeopleIcon /> },
            { title: "Centro de Costos", desc: "Tenga control total sobre los costos de su negocio", link: '/costos', icon: <AttachMoneyIcon /> },
            { title: "Proveedores", desc: "Ten control total de tus proveedores", link: '/suppliers', icon: <StorefrontIcon /> },
            { title: "Data", desc: "Entiende tu negocio desde los datos", link: '/data', icon: <WaterfallChartIcon /> },
            { title: "Parametros", desc: "Personaliza tu software al 100% para tener lo que quieres", link: '/params', icon: <SettingsIcon /> },
            { title: "Gastos", desc: "Ten control de tus gastos de operación", link: '/gastos', icon: <PaymentIcon /> }
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '2rem',
                  borderRadius: '18px',
                  transition: 'transform 0.3s',
                  border: '2px solid black',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}>
                  <Avatar sx={{ mb: 2, backgroundColor: '#5E55FE', color: 'white' }}>
                    {item.icon || item.title.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {item.desc}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f0f0f0', width: '100%' }}>
        <Typography variant="body2" align="center">
          Desarrollado por:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <img src={logoDeveloper} alt="Logo del desarrollador" width="150" />
        </Box>
      </Box>
      
    </Container>
  );
}

export default HomePage;
