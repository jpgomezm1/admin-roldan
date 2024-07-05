import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// Reutilizamos el StyledTableCell de OrderTable.jsx
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const Modals = ({
  openComprobante,
  openProductos,
  handleCloseComprobanteDialog,
  handleCloseProductosDialog,
  selectedComprobante,
  selectedProductos,
  productsMap,
}) => {
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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
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
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Producto</StyledTableCell>
                    <StyledTableCell align="right">Cantidad</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProductos.map((prod, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {productsMap[prod.id]}
                      </TableCell>
                      <TableCell align="right">{prod.quantity}</TableCell>
                    </TableRow>
                  ))}
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

