import React from 'react';
import { CardContent, Typography, Grid, Button, Box, Card } from '@mui/material';
import { styled } from '@mui/system';

const ProductCard = styled(Card)(({ theme }) => ({
  border: '1px solid black',
  maxWidth: 345,
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const IntermedioCardComponent = ({ producto, handleOpenRecipeDialog, handleEditProduct, handleDeleteProduct }) => (
  <Grid item key={producto.nombre} xs={12} sm={6} md={4}>
    <ProductCard>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {producto.nombre}
        </Typography>

        {producto.costo && (
          <>
            <Typography variant="h6" color="textSecondary">
              Costo: {formatCurrency(producto.costo)}
            </Typography>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={() => handleOpenRecipeDialog(producto)}
            sx={{ color: '#5E55FE', borderRadius: '8px', mr: 1 }}
          >
            {producto.receta ? 'Ver Receta' : 'Agregar Receta'}
          </Button>
          <Button
            onClick={() => handleEditProduct(producto)}
            sx={{ color: '#5E55FE', borderRadius: '8px', mr: 1 }}
          >
            Editar
          </Button>
          <Button
            onClick={() => handleDeleteProduct(producto.id)}
            sx={{ color: '#ff0000', borderRadius: '8px' }}
          >
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </ProductCard>
  </Grid>
);

export default IntermedioCardComponent;

