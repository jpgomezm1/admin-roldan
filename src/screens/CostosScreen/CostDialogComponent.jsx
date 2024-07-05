import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, FormControl, Box
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const CostDialogComponent = ({
  open,
  selectedProduct,
  selectedInsumos,
  insumos,
  costo,
  setCosto,
  unidadesProducidas,
  handleUnidadesProducidasChange,
  handleCloseDialog,
  handleSaveCosto,
  handleAddInsumo,
  handleInsumoChange
}) => (
  <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
    <DialogTitle sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Actualizar Costo del Producto</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ mb: 2 }}>
        Ingresa el costo del producto {selectedProduct?.nombre}, selecciona los insumos necesarios y la cantidad de unidades que se obtienen de la receta:
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="Costo por Unidad"
        type="number"
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
      <Button onClick={handleSaveCosto} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Guardar</Button>
    </DialogActions>
  </Dialog>
);

export default CostDialogComponent;

