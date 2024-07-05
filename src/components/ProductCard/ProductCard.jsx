import React from 'react';
import { CardContent, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
import { ProductCard, ProductMedia } from '../../styles/styledComponents';

function ProductoCard({ producto, onDelete, onEdit }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ProductCard>
        <ProductMedia
          component="img"
          alt="Imagen del producto"
          image={producto.imagen_url || 'path_to_default_image.jpg'}
          title={producto.nombre}
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
            Precio: {formatCurrency(producto.precio)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Categoría: {producto.categoria}
          </Typography>
          <div>
            <IconButton onClick={() => onEdit(producto)} size="small" sx={{ color: '#5E55FE', marginRight: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(producto)} size="small" sx={{ color: red[500] }}>
              <DeleteIcon />
            </IconButton>
          </div>
        </CardContent>
      </ProductCard>
    </Grid>
  );
}

export default ProductoCard;

