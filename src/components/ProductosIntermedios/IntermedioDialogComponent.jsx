import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, FormControl, Box, Typography, Autocomplete } from '@mui/material';

const IntermedioDialogComponent = ({ open, insumos, handleCloseDialog, handleSaveIntermedio, selectedProduct }) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [selectedInsumos, setSelectedInsumos] = useState([]);
  const [cantidadObtenida, setCantidadObtenida] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setNombreProducto(selectedProduct.nombre);
      setSelectedInsumos(selectedProduct.insumos);
      setCantidadObtenida(selectedProduct.unidades_producidas); // Asegúrate de usar unidades_producidas
    } else {
      setNombreProducto('');
      setSelectedInsumos([]);
      setCantidadObtenida('');
    }
  }, [selectedProduct]);

  const handleAddInsumo = () => {
    setSelectedInsumos([...selectedInsumos, { insumoId: '', cantidad: '', unidad: '' }]);
  };

  const handleInsumoChange = (index, field, value) => {
    const newInsumos = [...selectedInsumos];
    newInsumos[index][field] = value;
    setSelectedInsumos(newInsumos);
  };

  const calculateCost = () => {
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
    return totalCost;
  };

  const handleSave = () => {
    const cost = calculateCost();
    const newProduct = {
      nombre: nombreProducto,
      insumos: selectedInsumos,
      unidades_producidas: cantidadObtenida, // Asegúrate de incluir este campo
      costo: cost,
    };
    handleSaveIntermedio(newProduct);
    handleCloseDialog();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>{selectedProduct ? 'Editar Producto Intermedio' : 'Agregar Producto Intermedio'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingresa el nombre del producto, los insumos necesarios y la cantidad obtenida:
        </DialogContentText>
        <TextField
          margin="dense"
          label="Nombre del Producto"
          type="text"
          fullWidth
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
          sx={{ mb: 3 }}
        />
        {selectedInsumos.map((insumo, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControl sx={{ mr: 2, flex: 1 }}>
              <Autocomplete
                options={insumos}
                getOptionLabel={(option) => option.nombre}
                value={insumos.find(i => i.id === insumo.insumoId) || null}
                onChange={(e, newValue) => handleInsumoChange(index, 'insumoId', newValue ? newValue.id : '')}
                renderInput={(params) => (
                  <TextField {...params} label="Insumo" variant="outlined" fullWidth />
                )}
              />
            </FormControl>
            <TextField
              label="Cantidad"
              type="number"
              value={insumo.cantidad}
              onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
              sx={{ mr: 2, flex: 1 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <Autocomplete
                options={['g', 'kg', 'ml', 'l', 'unidades']}
                getOptionLabel={(option) => option}
                value={insumo.unidad || ''}
                onChange={(e, newValue) => handleInsumoChange(index, 'unidad', newValue || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Unidad" variant="outlined" fullWidth />
                )}
              />
            </FormControl>
          </Box>
        ))}
        <Button onClick={handleAddInsumo} sx={{ mt: 2, color: '#5E55FE', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
          Agregar Insumo
        </Button>
        <TextField
          margin="dense"
          label="Cantidad Obtenida (kg/l)"
          type="number"
          fullWidth
          value={cantidadObtenida}
          onChange={(e) => setCantidadObtenida(e.target.value)}
          sx={{ mt: 3 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancelar</Button>
        <Button onClick={handleSave}>{selectedProduct ? 'Guardar Cambios' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IntermedioDialogComponent;


