import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, AppBar } from '@mui/material';
import CategoriaTable from './CategoriaTable';
import SubcategoriaTable from './SubcategoriaTable'; // Import the new component for Subcategorias
import TabPanel from '../GastosScreen/TabPanel';

const ParametrosScreen = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold', color: '#5E55FE' }}>
        Configuración de Parámetros
      </Typography>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="parametros tabs"
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
          <Tab label="Categorías del Menú" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Subcategorías" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <CategoriaTable />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SubcategoriaTable />
      </TabPanel>
    </Box>
  );
};

export default ParametrosScreen;
