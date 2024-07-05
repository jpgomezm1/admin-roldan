import React from 'react';
import { CardContent, Typography, Grid, Button, Box } from '@mui/material';
import { ProductCard, ProductMedia } from '../../styles/styledComponents';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const calculateUtility = (precio, costo) => precio - costo;
const calculateMargin = (precio, costo) => ((precio - costo) / precio) * 100;

const ProductCardComponent = ({ producto, handleOpenDialog, handleOpenRecipeDialog }) => (
  <Grid item key={producto.id} xs={12} sm={6} md={4}>
    <ProductCard>
      <ProductMedia
        component="img"
        alt={producto.nombre}
        image={producto.imagen_url}
        title={producto.nombre}
        onClick={() => handleOpenDialog(producto)}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {producto.nombre}
        </Typography>
        <Typography variant="h6" color="textPrimary">
          Precio: {formatCurrency(producto.precio)}
        </Typography>

        {producto.costo && (
          <>
            <Typography variant="body2" color="textSecondary">
              Costo: {formatCurrency(producto.costo)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Utilidad: {formatCurrency(calculateUtility(producto.precio, producto.costo))}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Margen de Ganancia: {calculateMargin(producto.precio, producto.costo).toFixed(2)}%
            </Typography>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={() => handleOpenRecipeDialog(producto)}
            sx={{ color: '#5E55FE', borderRadius: '8px' }}
          >
            {producto.receta ? 'Ver Receta' : 'Agregar Receta'}
          </Button>
        </Box>
      </CardContent>
    </ProductCard>
  </Grid>
);

export default ProductCardComponent;

