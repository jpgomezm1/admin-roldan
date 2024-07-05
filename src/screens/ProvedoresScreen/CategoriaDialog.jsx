import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

function CategoriaDialog({ open, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    if (!open) {
      setNombre('');
      setTipo('');
    }
  }, [open]);

  const handleSave = () => {
    onSave({ nombre, tipo });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Categoría</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="nombre"
          label="Nombre de la Categoría"
          type="text"
          fullWidth
          variant="outlined"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="tipo-label">Tipo</InputLabel>
          <Select
            labelId="tipo-label"
            id="tipo"
            value={tipo}
            label="Tipo"
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="proveedor">Proveedor</MenuItem>
            <MenuItem value="producto">Producto</MenuItem>
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

export default CategoriaDialog;


