import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// Estilos para las celdas de la tabla con un diseño más sobrio
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100], // Un gris muy claro para el encabezado
  color: theme.palette.grey[900], // Texto oscuro para contraste
  fontWeight: 'bold',
  borderBottom: `2px solid ${theme.palette.divider}` // Borde más definido para separar los encabezados
}));

// Estilo para la celda del total, destacando el total de la factura
const TotalTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: theme.palette.grey[900],
  backgroundColor: theme.palette.grey[200], // Un fondo ligeramente más oscuro para resaltar el total
}));

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const Modals = ({
  openComprobante,
  openProductos,
  handleCloseComprobanteDialog,
  handleCloseProductosDialog,
  selectedComprobante,
  selectedProductos,
  productsMap
}) => {
  const totalPedido = selectedProductos.reduce((sum, prod) => sum + prod.quantity * prod.price, 0);
  const totalProductos = selectedProductos.reduce((sum, prod) => sum + prod.quantity, 0);

  return (
    <>
      <Dialog open={openComprobante} onClose={handleCloseComprobanteDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Comprobante de Pago
          <IconButton
            aria-label="close"
            onClick={handleCloseComprobanteDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'action.active',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <img src={selectedComprobante} alt="Comprobante de Pago" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openProductos} onClose={handleCloseProductosDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Productos del Pedido
          <IconButton
            aria-label="close"
            onClick={handleCloseProductosDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'action.active',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Producto</StyledTableCell>
                    <StyledTableCell align="right">Cantidad</StyledTableCell>
                    <StyledTableCell align="right">Precio</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProductos.map((prod, index) => (
                    <TableRow key={index}>
                      <TableCell>{productsMap[prod.id]}</TableCell>
                      <TableCell align="right">{prod.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(prod.price)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TotalTableCell>Tota</TotalTableCell>
                    <TotalTableCell align="right">{totalProductos}</TotalTableCell>
                    <TotalTableCell align="right">{formatCurrency(totalPedido)}</TotalTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Modals;
