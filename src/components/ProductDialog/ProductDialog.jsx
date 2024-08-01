import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Button,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Card, CardMedia
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/system';

const ReadOnlyTextField = styled(TextField)({
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

function ProductoDialog({ open, handleClose, handleChange, handleAddProducto, nuevoProducto, loading, editMode }) {
  const [categorias, setCategorias] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/categorias`);
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, [apiBaseUrl]);

  const calculatePrecioVenta = () => {
    const { precioBase, iva, ipo } = nuevoProducto;
    if (precioBase) {
      const base = parseFloat(precioBase);
      const ivaAmount = base * (iva / 100);
      const ipoAmount = parseFloat(ipo);
      return base + ivaAmount + ipoAmount;
    }
    return 0;
  };

  const calculateIvaAmount = () => {
    const { precioBase, iva } = nuevoProducto;
    if (precioBase) {
      const base = parseFloat(precioBase);
      return base * (iva / 100);
    }
    return 0;
  };

  const calculateIpoPercentage = () => {
    const { precioBase, ipo } = nuevoProducto;
    if (precioBase) {
      const base = parseFloat(precioBase);
      const ipoValue = parseFloat(ipo);
      return (ipoValue / base) * 100;
    }
    return 0;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombre"
          label="Nombre del Producto"
          type="text"
          fullWidth
          variant="outlined"
          name="nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="precioBase"
          label="Precio Base"
          type="number"
          fullWidth
          variant="outlined"
          name="precioBase"
          value={nuevoProducto.precioBase}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="costo"
          label="Costo del Producto"
          type="number"
          fullWidth
          variant="outlined"
          name="costo"
          value={nuevoProducto.costo}
          onChange={handleChange}
        />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="iva"
              label="IVA (%)"
              type="number"
              fullWidth
              variant="outlined"
              name="iva"
              value={nuevoProducto.iva}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyTextField
              margin="dense"
              id="ivaAmount"
              label="IVA (COP)"
              type="text"
              fullWidth
              variant="outlined"
              value={formatCurrency(calculateIvaAmount())}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="ipo"
              label="IPO (COP)"
              type="number"
              fullWidth
              variant="outlined"
              name="ipo"
              value={nuevoProducto.ipo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <ReadOnlyTextField
              margin="dense"
              id="ipoPercentage"
              label="IPO (%)"
              type="text"
              fullWidth
              variant="outlined"
              value={formatPercentage(calculateIpoPercentage())}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <ReadOnlyTextField
          margin="dense"
          id="precioVenta"
          label="Precio de Venta"
          type="text"
          fullWidth
          variant="outlined"
          value={formatCurrency(calculatePrecioVenta())}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          id="descripcion"
          label="Descripción del Producto"
          type="text"
          fullWidth
          variant="outlined"
          name="descripcion"
          value={nuevoProducto.descripcion || ''}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="categoria-label">Categoría</InputLabel>
          <Select
            labelId="categoria-label"
            id="categoria"
            value={nuevoProducto.categoria}
            label="Categoría"
            name="categoria"
            onChange={handleChange}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddCircleOutlineIcon />}
          size="medium"
          sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}
        >
          {editMode ? "Reemplazar Imagen" : "Subir Imagen"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleChange}
            name="imagen"
          />
        </Button>
        {nuevoProducto.imagen && (
          <Card sx={{ margin: '10px 0', maxWidth: 345 }}>
            <CardMedia
              component="img"
              sx={{ height: 200, objectFit: 'contain', width: '100%' }}
              image={nuevoProducto.imagen}
              alt="Vista previa de la imagen"
            />
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#5E55FE' }}>Cancelar</Button>
        <Button onClick={handleAddProducto} disabled={loading} sx={{ color: '#5E55FE' }}>
          {loading ? <CircularProgress size={24} /> : editMode ? 'Guardar Cambios' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductoDialog;
