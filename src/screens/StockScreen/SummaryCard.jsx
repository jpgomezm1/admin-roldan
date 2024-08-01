import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

const SummaryCard = ({ title, value, icon }) => {
  const theme = useTheme();

  const cardStyles = {
    width: '100%',
    maxWidth: 375,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7B11F5, #A46BF5)',
  };

  return (
    <Card sx={cardStyles}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ marginTop: 1, fontFamily: 'Poppins', fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 400 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
