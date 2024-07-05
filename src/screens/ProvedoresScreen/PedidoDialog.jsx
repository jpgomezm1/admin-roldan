import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from 'react-select';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

function PedidoDialog({ open, onClose, productos, proveedores }) {
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [totalCosto, setTotalCosto] = useState(0);

  const handleAddProducto = () => {
    if (selectedProducto && cantidad > 0) {
      const newSelectedProductos = [...selectedProductos, { ...selectedProducto, cantidad: parseInt(cantidad) }];
      setSelectedProductos(newSelectedProductos);
      setTotalCosto(prevTotal => prevTotal + (selectedProducto.precio * cantidad));
      setSelectedProducto(null);
      setCantidad('');
    }
  };

  const handleRemoveProducto = (index) => {
    const producto = selectedProductos[index];
    const newSelectedProductos = selectedProductos.filter((_, i) => i !== index);
    setSelectedProductos(newSelectedProductos);
    setTotalCosto(prevTotal => prevTotal - (producto.precio * producto.cantidad));
  };

  const handlePedidoSubmit = async () => {
    const pedido = {
      total_costo: totalCosto,
      detalles: selectedProductos.map(producto => ({
        producto_id: producto.id,
        cantidad: producto.cantidad,
        costo_total: producto.precio * producto.cantidad
      }))
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/pedidos_proveedores`, pedido);
      console.log('Pedido enviado:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
    }
  };

  const productoOptions = productos.map((producto) => ({
    value: producto.id,
    label: `${producto.nombre} (Proveedor: ${producto.proveedor.nombre})`,
    ...producto
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Realizar Pedido</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '1rem' }}>
          <Select
            value={selectedProducto}
            onChange={(selectedOption) => setSelectedProducto(selectedOption)}
            options={productoOptions}
            placeholder="Seleccione un producto"
          />
        </div>
        {selectedProducto && (
          <TextField
            type="number"
            label={`Cantidad (${selectedProducto.unidad})`}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProducto}
          disabled={!selectedProducto || cantidad <= 0}
          sx={{ mb: 2 }}
        >
          Agregar Producto
        </Button>
        <List>
          {selectedProductos.map((producto, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveProducto(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${producto.nombre} - Cantidad: ${producto.cantidad} ${producto.unidad}`}
                secondary={`Proveedor: ${producto.proveedor.nombre} - Total: ${formatCurrency(producto.precio * producto.cantidad)}`}
              />
            </ListItem>
          ))}
        </List>
        <div style={{ marginTop: '2rem' }}>
          <strong>Total Costo: {formatCurrency(totalCosto)}</strong>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handlePedidoSubmit} color="primary">Confirmar Pedido</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PedidoDialog;



