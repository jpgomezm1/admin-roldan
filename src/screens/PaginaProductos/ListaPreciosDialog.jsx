import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const ListaPreciosDialog = ({ open, handleClose, handleChange, handleAddLista, nuevaLista, editMode }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? 'Editar Lista de Precios' : 'Agregar Lista de Precios'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre de la Lista"
          type="text"
          fullWidth
          name="nombre"
          value={nuevaLista.nombre}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Descuento (%)"
          type="number"
          fullWidth
          name="descuento"
          value={nuevaLista.descuento}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancelar</Button>
        <Button onClick={handleAddLista} color="primary">{editMode ? 'Actualizar' : 'Agregar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListaPreciosDialog;
