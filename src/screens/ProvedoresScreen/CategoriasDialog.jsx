import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Typography, Grid, ToggleButton, ToggleButtonGroup, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function CategoriasDialog({ open, onClose, categorias, onSave, onEdit, onDelete }) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('producto');
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [view, setView] = useState('producto');

  useEffect(() => {
    if (!open) {
      setNombre('');
      setTipo('producto');
      setEditingCategoria(null);
    }
  }, [open]);

  useEffect(() => {
    if (editingCategoria) {
      setNombre(editingCategoria.nombre);
      setTipo(editingCategoria.tipo);
    }
  }, [editingCategoria]);

  const handleSave = () => {
    if (editingCategoria) {
      onEdit({ id: editingCategoria.id, nombre });
    } else {
      onSave({ nombre, tipo: view });
    }
    setEditingCategoria(null);  // Clear editing state after saving
    setNombre('');  // Clear input field after saving
  };

  const handleEditClick = (categoria) => {
    setEditingCategoria(categoria);
    setNombre(categoria.nombre);
    setTipo(categoria.tipo);
  };

  const handleCancel = () => {
    setNombre('');
    setTipo('producto');
    setEditingCategoria(null);
    onClose();
  };

  const handleViewChange = (e, newView) => {
    if (newView !== null) {
      setView(newView);
      setTipo(newView);
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        Administrar Categorías
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!editingCategoria && (
          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              sx={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
              <ToggleButton value="producto" sx={{ borderRadius: '10px 0 0 10px', fontWeight: 'bold' }}>Productos</ToggleButton>
              <ToggleButton value="proveedor" sx={{ borderRadius: '0 10px 10px 0', fontWeight: 'bold' }}>Proveedores</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {categorias.filter(categoria => categoria.tipo === view).map((categoria) => (
            <Grid item xs={12} sm={6} key={categoria.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '2px solid black',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Typography>{categoria.nombre}</Typography>
                <Box>
                  <Button onClick={() => handleEditClick(categoria)} startIcon={<EditIcon />} sx={{ color: '#5E55FE' }}></Button>
                  <Button onClick={() => onDelete(categoria.id)} startIcon={<DeleteIcon />} sx={{ color: 'red' }}></Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} sx={{ color: '#5E55FE' }}>Cancelar</Button>
        <Button onClick={handleSave} sx={{ color: '#5E55FE' }}>
          {editingCategoria ? 'Guardar Cambios' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoriasDialog;

