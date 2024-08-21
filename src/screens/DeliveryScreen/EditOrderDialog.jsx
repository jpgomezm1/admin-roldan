import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';

const EditOrderDialog = ({ open, handleClose, order, productsMap, setOrders, token }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (order) {
      setProductos(order.productosDetalles);
    }
  }, [order]);

  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...productos];
    updatedProductos[index][field] = value;
    setProductos(updatedProductos);
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: '', quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProductos = productos.filter((_, i) => i !== index);
    setProductos(updatedProductos);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/pedido/${order.id}/productos`, { productos }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, productosDetalles: productos, productos: productos.map(p => `${productsMap[p.id]} (x${p.quantity})`).join(', ') } : o
        )
      );

      handleClose();
    } catch (error) {
      console.error('Error updating order products:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Productos del Pedido</DialogTitle>
      <DialogContent>
        {productos.map((producto, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <TextField
              select
              label="Producto"
              value={producto.id}
              onChange={(e) => handleProductChange(index, 'id', e.target.value)}
              SelectProps={{ native: true }}
              variant="outlined"
              fullWidth
              style={{ marginRight: 8 }}
            >
              <option value="">Selecciona un producto</option>
              {Object.entries(productsMap).map(([id, nombre]) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
            </TextField>
            <TextField
              label="Cantidad"
              type="number"
              value={producto.quantity}
              onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value, 10))}
              variant="outlined"
              style={{ width: 100, marginRight: 8 }}
            />
            <IconButton onClick={() => handleRemoveProduct(index)}>
              <Remove />
            </IconButton>
          </div>
        ))}
        <Button startIcon={<Add />} onClick={handleAddProduct} color="primary">Agregar Producto</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
