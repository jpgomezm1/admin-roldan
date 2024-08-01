import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import ProductosCell from '../DeliveryScreen/ProductosCell';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SummaryCard from '../../components/SummaryCard/SummaryCard';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getRowStyle = (estado) => {
  switch (estado) {
    case 'Pedido Recibido':
      return { backgroundColor: '#ffeb3b' }; // Color amarillo claro
    case 'Pedido Facturado':
      return { backgroundColor: '#c8e6c9' }; // Color verde claro
    case 'Factura Pagada':
      return { backgroundColor: '#aed581' }; // Color verde más claro
    default:
      return {};
  }
};

const PedidosComercial = ({ comercial, open, onClose }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [openProductosDialog, setOpenProductosDialog] = useState(false);
  const [totalVendido, setTotalVendido] = useState(0);
  const [comision, setComision] = useState(0);
  const [comisionEfectiva, setComisionEfectiva] = useState(0); // Nuevo estado para Comisión Efectiva
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [availableMonths, setAvailableMonths] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (comercial && open) {
      fetchPedidos(comercial.idComercial);
    }
  }, [comercial, open]);

  const fetchPedidos = async (comercialId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/pedidos/comercial/${comercialId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pedidosData = response.data || [];
      setPedidos(pedidosData);
      const months = [...new Set(pedidosData.map(pedido => new Date(pedido.fecha_hora).getMonth() + 1))];
      setAvailableMonths(months);
      setSelectedMonth(months.includes(new Date().getMonth() + 1) ? new Date().getMonth() + 1 : 'all');
      calculateSummary(pedidosData, new Date().getMonth() + 1);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setPedidos([]); // En caso de error, asegúrate de que pedidos sea un array vacío
    }
    setLoading(false);
  };

  const calculateSummary = (pedidosData, month) => {
    const filteredPedidos = month === 'all' ? pedidosData : pedidosData.filter(pedido => new Date(pedido.fecha_hora).getMonth() + 1 === month);
    const totalVendido = filteredPedidos.reduce((sum, pedido) => sum + (pedido.total_con_descuento || pedido.total_productos), 0);
    setTotalVendido(totalVendido);
    setComision(totalVendido * 0.10);

    const totalVendidoEfectivo = filteredPedidos
      .filter(pedido => pedido.estado === 'Factura Pagada')
      .reduce((sum, pedido) => sum + (pedido.total_con_descuento || pedido.total_productos), 0);
    setComisionEfectiva(totalVendidoEfectivo * 0.10);
  };

  const handleOpenProductosDialog = (productos) => {
    setSelectedProductos(productos);
    setOpenProductosDialog(true);
  };

  const handleCloseProductosDialog = () => {
    setOpenProductosDialog(false);
    setSelectedProductos([]);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    calculateSummary(pedidos, newMonth);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h5" component="div" fontWeight="bold">
            Pedidos de {comercial?.nombre}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                label="Mes"
                onChange={handleMonthChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                {availableMonths.map(month => (
                  <MenuItem key={month} value={month}>
                    {new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date(2020, month - 1)).charAt(0).toUpperCase() + new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date(2020, month - 1)).slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <SummaryCard title="Total Vendido" value={totalVendido} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SummaryCard title="Comisión Potencial" value={comision} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SummaryCard title="Comisión Efectiva" value={comisionEfectiva} /> {/* Nueva tarjeta */}
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Nombre</StyledTableCell>
                    <StyledTableCell>Fecha</StyledTableCell>
                    <StyledTableCell>Productos</StyledTableCell>
                    <StyledTableCell>Total</StyledTableCell>
                    <StyledTableCell>Estado</StyledTableCell>
                    <StyledTableCell>NIT</StyledTableCell>
                    <StyledTableCell>Factura</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidos.filter(pedido => selectedMonth === 'all' || new Date(pedido.fecha_hora).getMonth() + 1 === selectedMonth).length > 0 ? (
                    pedidos.filter(pedido => selectedMonth === 'all' || new Date(pedido.fecha_hora).getMonth() + 1 === selectedMonth).map((pedido) => (
                      <TableRow key={pedido.id} style={getRowStyle(pedido.estado)}>
                        <TableCell>{pedido.id}</TableCell>
                        <TableCell>{pedido.nombre_completo}</TableCell>
                        <TableCell>{pedido.fecha_hora}</TableCell>
                        <TableCell>
                          <ProductosCell value={pedido.productos} row={pedido} onOpenDialog={handleOpenProductosDialog} />
                        </TableCell>
                        <TableCell>{formatCurrency(pedido.total_con_descuento || pedido.total_productos)}</TableCell>
                        <TableCell>{pedido.estado}</TableCell>
                        <TableCell>{pedido.nit || 'N/A'}</TableCell>
                        <TableCell>
                          {!pedido.factura_url ? (
                            <Typography variant="body2">No disponible</Typography>
                          ) : (
                            <IconButton onClick={() => window.open(pedido.factura_url, '_blank')}>
                              <VisibilityIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography>No hay pedidos para este mes.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
      <Dialog open={openProductosDialog} onClose={handleCloseProductosDialog} fullWidth maxWidth="md">
        <DialogTitle>Productos</DialogTitle>
        <DialogContent dividers>
          {selectedProductos && selectedProductos.length > 0 ? (
            selectedProductos.map((producto, index) => (
              <Typography key={index}>{producto.nombre}</Typography>
            ))
          ) : (
            <Typography>No hay productos para mostrar</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductosDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default PedidosComercial;
