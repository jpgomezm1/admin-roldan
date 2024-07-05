import React from 'react';
import { Link, Typography } from '@mui/material';

const PaymentMethodCell = ({ value, row, onOpenDialog }) => {
  const handleClick = () => {
    if (value === 'Transferencia' && row.comprobante_pago) {
      onOpenDialog(row.comprobante_pago);
    }
  };

  return value === 'Transferencia' ? (
    <Link
      component="button"
      variant="body2"
      onClick={handleClick}
      sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
    >
      {value}
    </Link>
  ) : (
    <Typography variant="body2">{value}</Typography>
  );
};

export default PaymentMethodCell;
