import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Button, Tabs, Tab, AppBar } from '@mui/material';
import ProductCardComponent from './ProductCardComponent';
import CostDialogComponent from './CostDialogComponent';
import NewProductCostDialogComponent from './NewProductCostDialogComponent';
import RecipeDialogComponent from './RecipeDialogComponent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ProductosIntermediosComponent from '../../components/ProductosIntermedios/ProductosIntermediosComponent';
import TabPanel from '../GastosScreen/TabPanel';

const CostosScreen = () => {
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedInsumos, setSelectedInsumos] = useState([]);
  const [costo, setCosto] = useState('');
  const [unidadesProducidas, setUnidadesProducidas] = useState(1); 
  const [openNewProductDialog, setOpenNewProductDialog] = useState(false);
  const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // New state for Tabs

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchInsumos = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/productos_proveedor`);
        setInsumos(response.data);
      } catch (error) {
        console.error('Error fetching insumos:', error);
      }
    };

    fetchProductos();
    fetchInsumos();
  }, [apiBaseUrl]);

  const handleOpenDialog = (producto) => {
    const updatedInsumos = (producto.insumos || []).map(insumo => ({
      ...insumo,
      insumoId: insumo.insumo_id
    }));
    setSelectedProduct(producto);
    setSelectedInsumos(updatedInsumos);
    setUnidadesProducidas(producto.unidades_producidas || 1);
    calculateCost(updatedInsumos, producto.unidades_producidas || 1);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setSelectedInsumos([]);
    setCosto('');
    setUnidadesProducidas(1);
  };

  const handleSaveCosto = async () => {
    try {
      const updatedProduct = {
        ...selectedProduct,
        costo: costo !== '' ? parseFloat(costo) : null,
        insumos: selectedInsumos.map(insumo => ({
          insumo_id: insumo.insumoId,
          cantidad: insumo.cantidad,
          unidad: insumo.unidad
        })),
        unidades_producidas: unidadesProducidas
      };
      await axios.put(`${apiBaseUrl}/productos/${selectedProduct.id}`, updatedProduct);
      setProductos(productos.map((producto) => (producto.id === selectedProduct.id ? updatedProduct : producto)));
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product cost:', error);
    }
  };

  const handleAddInsumo = () => {
    setSelectedInsumos([...selectedInsumos, { insumoId: '', cantidad: '', unidad: '' }]);
  };

  const handleInsumoChange = (index, field, value) => {
    const newInsumos = [...selectedInsumos];
    newInsumos[index][field] = value;
    setSelectedInsumos(newInsumos);
    calculateCost(newInsumos, unidadesProducidas);
  };

  const handleUnidadesProducidasChange = (value) => {
    setUnidadesProducidas(value);
    calculateCost(selectedInsumos, value);
  };

  const calculateCost = (selectedInsumos, unidadesProducidas) => {
    let totalCost = 0;
    selectedInsumos.forEach(insumo => {
      const insumoData = insumos.find(i => i.id === insumo.insumoId);
      if (insumoData) {
        let costPerUnit;
        switch (insumo.unidad) {
          case 'g':
            costPerUnit = insumoData.precio / (insumoData.cantidad * 1000);
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'kg':
            costPerUnit = insumoData.precio / insumoData.cantidad;
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'ml':
            costPerUnit = insumoData.precio / (insumoData.cantidad * 1000);
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'l':
            costPerUnit = insumoData.precio / insumoData.cantidad;
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'unidades':
            costPerUnit = insumoData.precio / insumoData.cantidad;
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          default:
            break;
        }
      }
    });
    const costPerUnit = totalCost / unidadesProducidas;
    setCosto(costPerUnit.toFixed(2));
  };

  const handleOpenRecipeDialog = (producto) => {
    setSelectedRecipeProduct(producto);
    setOpenRecipeDialog(true);
  };

  const handleCloseRecipeDialog = () => {
    setSelectedRecipeProduct(null);
    setOpenRecipeDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold', color: '#5E55FE' }}>
        Centro de Costos y Estandarización
      </Typography>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="costos tabs"
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
          <Tab label="Productos Finales" />
          <Tab label="Productos Intermedios" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <Box>
          <Button onClick={() => setOpenNewProductDialog(true)} sx={{ mt: 2, mb: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }} variant="contained" startIcon={<AttachMoneyIcon />}>
            Calcular el precio de un nuevo producto
          </Button>
          <Grid container spacing={2}>
            {productos.map((producto) => (
              <ProductCardComponent key={producto.id} producto={producto} handleOpenDialog={handleOpenDialog} handleOpenRecipeDialog={handleOpenRecipeDialog} />
            ))}
          </Grid>

          <CostDialogComponent
            open={!!selectedProduct}
            selectedProduct={selectedProduct}
            selectedInsumos={selectedInsumos}
            insumos={insumos}
            costo={costo}
            setCosto={setCosto}
            unidadesProducidas={unidadesProducidas}
            handleUnidadesProducidasChange={handleUnidadesProducidasChange}
            handleCloseDialog={handleCloseDialog}
            handleSaveCosto={handleSaveCosto}
            handleAddInsumo={handleAddInsumo}
            handleInsumoChange={handleInsumoChange}
          />
          
          <NewProductCostDialogComponent
            open={openNewProductDialog}
            insumos={insumos}
            handleCloseDialog={() => setOpenNewProductDialog(false)}
          />

          <RecipeDialogComponent
            open={openRecipeDialog}
            producto={selectedRecipeProduct}
            handleCloseDialog={handleCloseRecipeDialog}
          />
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ProductosIntermediosComponent />
      </TabPanel>
    </Box>
  );
};

export default CostosScreen;


