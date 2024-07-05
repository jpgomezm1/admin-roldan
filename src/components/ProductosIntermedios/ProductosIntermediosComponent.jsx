import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import axios from 'axios';
import IntermedioDialogComponent from './IntermedioDialogComponent';
import IntermedioCardComponent from './IntermedioCardComponent';
import IntermedioRecipeDialogComponent from './IntermedioRecipeDialogComponent';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const ProductosIntermediosComponent = () => {
  const [productosIntermedios, setProductosIntermedios] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/productos_proveedor`);
        setInsumos(response.data);
      } catch (error) {
        console.error('Error fetching insumos:', error);
      }
    };

    const fetchProductosIntermedios = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/productos_intermedios`);
        setProductosIntermedios(response.data);
      } catch (error) {
        console.error('Error fetching productos intermedios:', error);
      }
    };

    fetchInsumos();
    fetchProductosIntermedios();
  }, [apiBaseUrl]);

  const handleOpenDialog = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveIntermedio = async (newProduct) => {
    try {
      if (selectedProduct) {
        const response = await axios.put(`${apiBaseUrl}/productos_intermedios/${selectedProduct.id}`, newProduct);
        setProductosIntermedios(productosIntermedios.map(product => product.id === selectedProduct.id ? response.data : product));
      } else {
        const response = await axios.post(`${apiBaseUrl}/productos_intermedios`, newProduct);
        setProductosIntermedios([...productosIntermedios, response.data]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving producto intermedio:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${apiBaseUrl}/productos_intermedios/${productId}`);
      setProductosIntermedios(productosIntermedios.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting producto intermedio:', error);
    }
  };

  const handleOpenRecipeDialog = (producto) => {
    setSelectedProduct(producto);
    setOpenRecipeDialog(true);
  };

  const handleCloseRecipeDialog = () => {
    setSelectedProduct(null);
    setOpenRecipeDialog(false);
  };

  const handleEditProduct = (producto) => {
    setSelectedProduct(producto);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold', color: '#5E55FE' }}>
        Productos Intermedios
      </Typography>
      <Button onClick={handleOpenDialog} sx={{ mt: 2, mb: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }} variant="contained">
        Agregar Producto Intermedio
      </Button>
      <Grid container spacing={1}>
        {productosIntermedios.map((producto, index) => (
          <IntermedioCardComponent
            key={index}
            producto={producto}
            handleOpenRecipeDialog={handleOpenRecipeDialog}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}
      </Grid>
      <IntermedioDialogComponent
        open={openDialog}
        insumos={insumos}
        handleCloseDialog={handleCloseDialog}
        handleSaveIntermedio={handleSaveIntermedio}
        selectedProduct={selectedProduct}
      />
      {selectedProduct && (
        <IntermedioRecipeDialogComponent
          open={openRecipeDialog}
          producto={selectedProduct}
          insumos={insumos}
          handleCloseDialog={handleCloseRecipeDialog}
        />
      )}
    </Box>
  );
};

export default ProductosIntermediosComponent;

