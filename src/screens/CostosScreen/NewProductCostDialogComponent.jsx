import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, FormControl, Box
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const NewProductCostDialogComponent = ({
  open,
  insumos,
  handleCloseDialog
}) => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [selectedInsumos, setSelectedInsumos] = useState([]);
  const [unidadesProducidas, setUnidadesProducidas] = useState(1);
  const [margen, setMargen] = useState(0);
  const [costo, setCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');

  const handleAddInsumo = () => {
    setSelectedInsumos([...selectedInsumos, { insumoId: '', cantidad: '', unidad: '' }]);
  };

  const handleInsumoChange = (index, field, value) => {
    const newInsumos = [...selectedInsumos];
    newInsumos[index][field] = value;
    setSelectedInsumos(newInsumos);
    calculateCost(newInsumos, unidadesProducidas, margen);
  };

  const handleUnidadesProducidasChange = (value) => {
    setUnidadesProducidas(value);
    calculateCost(selectedInsumos, value, margen);
  };

  const handleMargenChange = (value) => {
    setMargen(value);
    calculateCost(selectedInsumos, unidadesProducidas, value);
  };

  const calculateCost = (selectedInsumos, unidadesProducidas, margen) => {
    let totalCost = 0;
    selectedInsumos.forEach(insumo => {
      const insumoData = insumos.find(i => i.id === insumo.insumoId);
      if (insumoData) {
        let costPerUnit;
        switch (insumo.unidad) {
          case 'g':
            costPerUnit = insumoData.precio / (insumoData.cantidad * 1000); // Precio por gramo
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'kg':
            costPerUnit = insumoData.precio / insumoData.cantidad; // Precio por kilogramo
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'ml':
            costPerUnit = insumoData.precio / (insumoData.cantidad * 1000); // Precio por mililitro
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'l':
            costPerUnit = insumoData.precio / insumoData.cantidad; // Precio por litro
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          case 'unidades':
            costPerUnit = insumoData.precio / insumoData.cantidad; // Precio por unidad
            totalCost += costPerUnit * parseFloat(insumo.cantidad || 0);
            break;
          default:
            break;
        }
      }
    });
    const costPerUnit = totalCost / unidadesProducidas;
    const calculatedPrice = costPerUnit + (costPerUnit * (margen / 100));
    setCosto(formatCurrency(costPerUnit));
    setPrecioVenta(formatCurrency(calculatedPrice));
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Calcular Precio de Nuevo Producto</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Ingresa el nombre del producto, los insumos necesarios, la cantidad de unidades que se obtienen de la receta, y el margen deseado:
        </DialogContentText>
        <TextField
          margin="dense"
          label="Nombre del Producto"
          type="text"
          fullWidth
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          margin="dense"
          label="Costo por Unidad"
          type="text"
          fullWidth
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          disabled
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          margin="dense"
          label="Precio de Venta"
          type="text"
          fullWidth
          value={precioVenta}
          onChange={(e) => setPrecioVenta(e.target.value)}
          disabled
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          margin="dense"
          label="Unidades Producidas"
          type="number"
          fullWidth
          value={unidadesProducidas}
          onChange={(e) => handleUnidadesProducidasChange(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          margin="dense"
          label="Margen Deseado (%)"
          type="number"
          fullWidth
          value={margen}
          onChange={(e) => handleMargenChange(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
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
                  <TextField
                    {...params}
                    label="Insumo"
                    variant="outlined"
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  />
                )}
              />
            </FormControl>
            <TextField
              label="Cantidad"
              type="number"
              value={insumo.cantidad}
              onChange={(e) => handleInsumoChange(index, 'cantidad', e.target.value)}
              sx={{
                mr: 2,
                flex: 1,
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                },
              }}
            />
            <FormControl sx={{ flex: 1 }}>
              <Autocomplete
                options={['g', 'kg', 'ml', 'l', 'unidades']}
                getOptionLabel={(option) => option}
                value={insumo.unidad || ''}
                onChange={(e, newValue) => handleInsumoChange(index, 'unidad', newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unidad"
                    variant="outlined"
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                  />
                )}
              />
            </FormControl>
          </Box>
        ))}
        <Button onClick={handleAddInsumo} sx={{ mt: 2, color: '#5E55FE', borderRadius: '8px', bgcolor: '#f5f5f5' }}>
          Agregar Insumo
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDialog} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProductCostDialogComponent;

