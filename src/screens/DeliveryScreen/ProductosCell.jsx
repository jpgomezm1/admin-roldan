import React from 'react';
import { Link } from '@mui/material';

const ProductosCell = ({ row, onOpenDialog }) => {
  const handleClick = () => {
    onOpenDialog(row.productosDetalles);
  };

  return (
    <Link
      component="button"
      variant="body2"
      onClick={handleClick}
      sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
    >
      Ver Pedido
    </Link>
  );
};

export default ProductosCell;
