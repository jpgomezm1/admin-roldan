import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

function ProductoDialog({ open, onClose, onSave, proveedores, categorias, producto }) {
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', cantidad: '', unidad: '', proveedorId: '', categoriaId: '' });

  useEffect(() => {
    if (producto) {
      setNuevoProducto({
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad,
        unidad: producto.unidad,
        proveedorId: producto.proveedor.id,
        categoriaId: producto.categoria ? producto.categoria.id : ''
      });
    } else {
      setNuevoProducto({ nombre: '', precio: '', cantidad: '', unidad: '', proveedorId: '', categoriaId: '' });
    }
  }, [producto, open]);

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(nuevoProducto);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{producto ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
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
          id="precio"
          label="Precio"
          type="number"
          fullWidth
          variant="outlined"
          name="precio"
          value={nuevoProducto.precio}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="cantidad"
          label="Cantidad"
          type="number"
          fullWidth
          variant="outlined"
          name="cantidad"
          value={nuevoProducto.cantidad}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="unidad-label">Unidad</InputLabel>
          <Select
            labelId="unidad-label"
            id="unidad"
            value={nuevoProducto.unidad}
            label="Unidad"
            name="unidad"
            onChange={handleChange}
          >
            <MenuItem value="kg">Kg</MenuItem>
            <MenuItem value="l">Litros</MenuItem>
            <MenuItem value="unidades">Unidades</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="proveedorId-label">Proveedor</InputLabel>
          <Select
            labelId="proveedorId-label"
            id="proveedorId"
            value={nuevoProducto.proveedorId}
            label="Proveedor"
            name="proveedorId"
            onChange={handleChange}
          >
            {proveedores.map((proveedor) => (
              <MenuItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="categoriaId-label">Categoría</InputLabel>
          <Select
            labelId="categoriaId-label"
            id="categoriaId"
            value={nuevoProducto.categoriaId}
            label="Categoría"
            name="categoriaId"
            onChange={handleChange}
          >
            {categorias.filter(cat => cat.tipo === 'producto').map((categoria) => (
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

export default ProductoDialog;

