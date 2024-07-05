import React from 'react';
import { Paper, Typography } from '@mui/material';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const SummaryCard = ({ title, value }) => {
  return (
    <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#E3F2FD', border: '1px solid black', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
        {formatCurrency(value)}
      </Typography>
    </Paper>
  );
};

export default SummaryCard;
