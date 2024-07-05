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
    cursor: 'pointer',
  },
};

function ProveedorCard({ proveedor, onClick, onEdit, onDelete }) {
  return (
    <Card onClick={onClick} sx={cardStyles}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" align="center">{proveedor.nombre}</Typography>
        <Typography variant="body2" align="center">Contacto: {proveedor.telefono}</Typography>
        <Typography variant="body2" align="center">Categoría: {proveedor.categoria ? proveedor.categoria.nombre : 'Sin Categoría'}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProveedorCard;
