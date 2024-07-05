import React from 'react';
import { Box, Typography } from '@mui/material';

const KPICard = ({ title, value }) => {
  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 1, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: '#5E55FE', fontWeight: 'bold' }}>{title}</Typography>
      <Typography variant="h4" sx={{ color: '#000', fontWeight: 'bold' }}>{value}</Typography>
    </Box>
  );
};

export default KPICard;
