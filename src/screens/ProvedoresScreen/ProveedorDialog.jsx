import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

function ProveedorDialog({ open, onClose, onSave, categorias, proveedor }) {
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '', telefono: '', categoriaId: '' });

  useEffect(() => {
    if (proveedor) {
      setNuevoProveedor({
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        categoriaId: proveedor.categoria ? proveedor.categoria.id : ''
      });
    } else {
      setNuevoProveedor({ nombre: '', telefono: '', categoriaId: '' });
    }
  }, [proveedor, open]);

  const handleChange = (e) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(nuevoProveedor);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{proveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombre"
          label="Nombre del Proveedor"
          type="text"
          fullWidth
          variant="outlined"
          name="nombre"
          value={nuevoProveedor.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="telefono"
          label="Teléfono"
          type="text"
          fullWidth
          variant="outlined"
          name="telefono"
          value={nuevoProveedor.telefono}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="categoriaId-label">Categoría</InputLabel>
          <Select
            labelId="categoriaId-label"
            id="categoriaId"
            value={nuevoProveedor.categoriaId}
            label="Categoría"
            name="categoriaId"
            onChange={handleChange}
          >
            {categorias.filter(cat => cat.tipo === 'proveedor').map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#5E55FE' }}>Cancelar</Button>
        <Button onClick={handleSave} sx={{ color: '#5E55FE' }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProveedorDialog;
