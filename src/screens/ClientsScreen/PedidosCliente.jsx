import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProductosCell from '../DeliveryScreen/ProductosCell';

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

const PedidosCliente = ({ client, open, onClose }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (client && open) {
      fetchPedidos(client.nit);
    }
  }, [client, open]);

  const fetchPedidos = async (nit) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/pedidos`, {
        params: { nit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPedidos(response.data);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Pedidos de {client?.nombre}
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
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
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
                  <StyledTableCell>Factura</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <TableRow key={pedido.id} style={getRowStyle(pedido.estado)}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{pedido.nombre_completo}</TableCell>
                      <TableCell>{pedido.fecha_hora}</TableCell>
                      <TableCell>
                        <ProductosCell value={pedido.productos} row={pedido} />
                      </TableCell>
                      <TableCell>{formatCurrency(pedido.total_con_descuento || pedido.total_productos)}</TableCell>
                      <TableCell>{pedido.estado}</TableCell>
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
                    <TableCell colSpan={7}>
                      <Typography>No hay pedidos para este cliente.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PedidosCliente;
