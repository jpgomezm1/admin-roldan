import React from 'react';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProductosCell = ({ value, row, onOpenDialog }) => {
  const handleOpen = () => {
    onOpenDialog(row.productosDetalles);
  };

  return (
    <IconButton onClick={handleOpen}>
      <VisibilityIcon />
    </IconButton>
  );
};

export default ProductosCell;
