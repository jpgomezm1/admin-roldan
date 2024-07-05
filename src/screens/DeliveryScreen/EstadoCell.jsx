import React from 'react';
import { Select, MenuItem } from '@mui/material';

const EstadoCell = ({ value, row, onEstadoChange }) => {
  const handleChange = (event) => {
    onEstadoChange(row.id, event.target.value);
  };

  return (
    <Select value={value} onChange={handleChange} variant="standard" fullWidth>
      <MenuItem value="Pedido Recibido">Pedido Recibido</MenuItem>
      <MenuItem value="Pedido Confirmado">Pedido Confirmado</MenuItem>
      <MenuItem value="Pedido Enviado">Pedido Enviado</MenuItem>
      <MenuItem value="Pedido Rechazado">Pedido Rechazado</MenuItem>
    </Select>
  );
};

export default EstadoCell;
