import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, AppBar } from '@mui/material';
import OtrosGastos from './OtrosGastos';
import GastosProveedores from './GastosProveedores';
import TabPanel from './TabPanel';

const GastosScreen = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold', color: '#5E55FE' }}>
        Registro de Gastos
      </Typography>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="gastos tabs"
          TabIndicatorProps={{ style: { backgroundColor: '#5E55FE', height: '4px' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#5E55FE',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: '#ffffff',
                backgroundColor: '#5E55FE',
              },
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: '1px solid #5E55FE',
            },
          }}
        >
          <Tab label="Gastos Operacion" />
          <Tab label="Gastos de Proveedores" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <OtrosGastos />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <GastosProveedores />
      </TabPanel>
    </Box>
  );
};

export default GastosScreen;


