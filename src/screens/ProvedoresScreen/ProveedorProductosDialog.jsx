import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Typography
} from '@mui/material';
import ProductoCard from './ProductoCard';

function ProveedorProductosDialog({ open, onClose, productos }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Productos del Proveedor</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <ProductoCard producto={producto} />
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No hay productos para este proveedor.</Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#5E55FE' }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProveedorProductosDialog;


