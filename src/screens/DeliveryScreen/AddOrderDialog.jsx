import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Box, Stack, Grid, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const AddOrderDialog = ({ open, handleClose, productsMap, setOrders, token }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [direccion, setDireccion] = useState('');
  const [productos, setProductos] = useState([{ id: '', quantity: 1 }]);
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaHora, setFechaHora] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [costoDomicilio, setCostoDomicilio] = useState('');
  const [esPuntoVenta, setEsPuntoVenta] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset fields when the dialog opens
      setNombreCompleto('');
      setNumeroTelefono('');
      setCorreoElectronico('');
      setDireccion('');
      setProductos([{ id: '', quantity: 1 }]);
      setMetodoPago('');
      setFechaHora(dayjs().format('YYYY-MM-DDTHH:mm'));
      setCostoDomicilio('');
      setEsPuntoVenta(false);
    }
  }, [open]);

  const handleProductoChange = (index, key, value) => {
    const newProductos = [...productos];
    newProductos[index][key] = key === 'quantity' ? parseInt(value, 10) : value;
    setProductos(newProductos);
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: '', quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const newOrder = {
      nombre_completo: esPuntoVenta ? 'Punto de Venta' : nombreCompleto,
      numero_telefono: esPuntoVenta ? '0000000000' : numeroTelefono,
      correo_electronico: esPuntoVenta ? 'puntodeventa@zeendr.com' : correoElectronico,
      direccion: esPuntoVenta ? 'Punto de Venta' : direccion,
      productos: JSON.stringify(productos),
      metodo_pago: metodoPago,
      fecha_hora: fechaHora,
      costo_domicilio: esPuntoVenta ? 0 : parseFloat(costoDomicilio)
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pedido_manual`, newOrder, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(prevOrders => [...prevOrders, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#f3f4f6', color: '#7B12F5', fontWeight: 'bold' }}>
        Agregar Nueva Orden
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <FormControlLabel
          control={<Checkbox checked={esPuntoVenta} onChange={(e) => setEsPuntoVenta(e.target.checked)} />}
          label="Orden en Punto de Venta"
        />
        <Grid container spacing={3}>
          {!esPuntoVenta && (
            <>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Nombre Completo"
                  fullWidth
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Número de Teléfono"
                  fullWidth
                  value={numeroTelefono}
                  onChange={(e) => setNumeroTelefono(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Correo Electrónico"
                  fullWidth
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Dirección"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
            </>
          )}
          {productos.map((producto, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" alignItems="center">
                <FormControl fullWidth margin="dense" sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={producto.id}
                    onChange={(e) => handleProductoChange(index, 'id', e.target.value)}
                    label="Producto"
                  >
                    {Object.entries(productsMap).map(([id, nombre]) => (
                      <MenuItem key={id} value={id}>
                        {nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="Cantidad"
                  type="number"
                  value={producto.quantity}
                  onChange={(e) => handleProductoChange(index, 'quantity', e.target.value)}
                  sx={{ width: 100, marginLeft: 2, '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
                <IconButton onClick={handleAddProduct} color="primary">
                  <AddCircleIcon />
                </IconButton>
                {productos.length > 1 && (
                  <IconButton onClick={() => handleRemoveProduct(index)} color="secondary">
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Método de Pago"
              fullWidth
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Fecha y Hora"
              type="datetime-local"
              fullWidth
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {!esPuntoVenta && (
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Costo del Domicilio"
                type="number"
                fullWidth
                value={costoDomicilio}
                onChange={(e) => setCostoDomicilio(e.target.value)}
                sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button 
            onClick={handleClose} 
            sx={{ color: '#5E55FE', borderRadius: '10px' }}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            sx={{ color: '#5E55FE', borderRadius: '10px' }}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderDialog;
