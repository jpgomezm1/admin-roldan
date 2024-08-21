import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  TextField, Select, MenuItem, FormControl, InputLabel, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tooltip, Typography, Box, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const ExecuteInventoryDialog = ({ open, handleClose, bodegas, productos, onInventoryUpdate }) => {
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState('');
  const [inventarioManual, setInventarioManual] = useState({});
  const [responsable, setResponsable] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [estadoInventario, setEstadoInventario] = useState(''); // Estado global del inventario
  const [diferenciaTotal, setDiferenciaTotal] = useState(0); // Diferencia total de inventario

  useEffect(() => {
    if (open) {
      setBodegaSeleccionada('');
      setInventarioManual({});
      setResponsable('');
      setEstadoInventario('');
      setDiferenciaTotal(0);
    }
  }, [open]);

  useEffect(() => {
    if (bodegaSeleccionada) {
      const initialInventory = productos.reduce((acc, producto) => {
        acc[producto.id] = { cantidad: 0, alerta: '', diferencia: 0 };
        return acc;
      }, {});
      setInventarioManual(initialInventory);
    }
  }, [bodegaSeleccionada, productos]);

  useEffect(() => {
    calcularEstadoInventario();
  }, [inventarioManual]);

  const handleBodegaChange = (event) => {
    setBodegaSeleccionada(event.target.value);
    setEstadoInventario('');
    setDiferenciaTotal(0);
  };

  const handleCantidadChange = (productoId, cantidad) => {
    const cantidadNumerica = cantidad === '' ? '' : parseInt(cantidad, 10);
    const stockRegistrado = productos.find((producto) => producto.id === productoId).stocks[bodegaSeleccionada] || 0;

    const alerta = cantidadNumerica > stockRegistrado
      ? 'greater'
      : cantidadNumerica < stockRegistrado
      ? 'less'
      : 'equal';

    const diferencia = cantidadNumerica === '' ? 0 : cantidadNumerica - stockRegistrado;

    setInventarioManual((prev) => ({
      ...prev,
      [productoId]: { cantidad: cantidadNumerica, alerta, diferencia },
    }));
  };

  const calcularEstadoInventario = () => {
    let todasCorrectas = true;
    let diferenciaAcumulada = 0;

    for (const item of Object.values(inventarioManual)) {
      if (item.alerta !== 'equal') {
        todasCorrectas = false;
      }
      diferenciaAcumulada += item.diferencia || 0;
    }

    setDiferenciaTotal(diferenciaAcumulada);
    setEstadoInventario(todasCorrectas ? 'correcto' : 'discrepancia');
  };

  const getAlertDetails = (alerta) => {
    switch (alerta) {
      case 'greater':
        return { icon: <WarningIcon color="warning" />, text: 'Cantidad Mayor' };
      case 'less':
        return { icon: <ErrorIcon color="error" />, text: 'Cantidad Menor' };
      case 'equal':
        return { icon: <CheckCircleIcon color="success" />, text: 'Cantidad Correcta' };
      default:
        return { icon: <InfoIcon color="disabled" />, text: 'Sin Cambios' };
    }
  };

  const isSaveDisabled = Object.values(inventarioManual).some(item => item.cantidad === '');

  const handleSave = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!bodegaSeleccionada) {
      alert("Por favor selecciona una bodega.");
      return;
    }
    if (!responsable) {
      alert("Por favor ingresa el nombre del responsable.");
      return;
    }
  
    try {
      const response = await axios.post('/inventarios/ejecutar', {
        bodega_id: bodegaSeleccionada,
        inventario: inventarioManual,
        responsable,
      });
      onInventoryUpdate();
      setConfirmDialogOpen(false);
      handleClose();
    } catch (error) {
      console.error('Error al ejecutar inventario', error);
      alert('Error al ejecutar inventario');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Ejecutar Inventario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Bodega</InputLabel>
            <Select value={bodegaSeleccionada} onChange={handleBodegaChange}>
              {bodegas.map((bodega) => (
                <MenuItem key={bodega.id} value={bodega.id}>
                  {bodega.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Bodega Seleccionada: {bodegas.find((b) => b.id === bodegaSeleccionada)?.nombre || 'Ninguna'}
          </Typography>
          <TextField
            margin="dense"
            label="Responsable"
            fullWidth
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
          />
          {estadoInventario && (
            <Alert severity={estadoInventario === 'correcto' ? 'success' : 'warning'} sx={{ mt: 2 }}>
              {estadoInventario === 'correcto' ? 'Todas las cantidades son correctas.' : 'Hay discrepancias en el inventario.'}
              {diferenciaTotal !== 0 && (
                <Typography variant="body2">
                  Diferencia total: {diferenciaTotal > 0 ? `+${diferenciaTotal}` : diferenciaTotal} unidades.
                </Typography>
              )}
            </Alert>
          )}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad Manual</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Diferencia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => {
                  const alerta = inventarioManual[producto.id]?.alerta || '';
                  const { icon, text } = getAlertDetails(alerta);
                  const diferencia = inventarioManual[producto.id]?.diferencia || 0;
                  return (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={inventarioManual[producto.id]?.cantidad === 0 || inventarioManual[producto.id]?.cantidad === '' ? inventarioManual[producto.id]?.cantidad : inventarioManual[producto.id]?.cantidad || ''}
                          onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 0 }}
                          sx={{ textAlign: 'center' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={text} arrow>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            {icon}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {text}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color={diferencia > 0 ? 'green' : diferencia < 0 ? 'red' : 'inherit'}>
                          {diferencia > 0 ? `+${diferencia}` : diferencia}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={isSaveDisabled}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar Inventario</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas guardar los cambios en el inventario? Esta acción actualizará las cantidades de cada referencia en el sistema.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary" variant="outlined">Cancelar</Button>
          <Button onClick={handleConfirmSave} color="primary" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExecuteInventoryDialog;


