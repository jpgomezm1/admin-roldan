import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const cardStyles = {
  width: '100%',
  height: 'auto',
  borderRadius: '18px',
  transition: 'transform 0.3s',
  border: '2px solid black',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
};

function ProductoCard({ producto, onEdit, onDelete }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card sx={cardStyles}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" align="center">{producto.nombre}</Typography>
        <Typography variant="body2" align="center">Precio: {formatCurrency(producto.precio)} x {producto.cantidad} {producto.unidad}</Typography>
        <Typography variant="body2" align="center">Proveedor: {producto.proveedor.nombre}</Typography>
        <Typography variant="body2" align="center">Categoría: {producto.categoria ? producto.categoria.nombre : 'Sin Categoría'}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductoCard;
