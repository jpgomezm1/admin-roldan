import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

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
      <Typography variant="h5" component="div" sx={ { fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h4" component="div" color="primary" sx={ { fontWeight: 'bold' }}> 
        {value}
      </Typography>
    </Paper>
  );
};

const SummaryCards = ({ totalVentas, totalProductos, totalDomicilios, numeroPedidos }) => {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SummaryCard title="Total Ventas" value={formatCurrency(totalVentas)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Total Productos" value={formatCurrency(totalProductos)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Total Domicilios" value={formatCurrency(totalDomicilios)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Número de Pedidos" value={numeroPedidos} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryCards;
