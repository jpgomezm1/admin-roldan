import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Box, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import ProductosCell from './ProductosCell';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import './DeliveryScreen.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

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

const OrderTable = ({ orders, onOpenProductosDialog, setOrders }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFacturaUrl, setSelectedFacturaUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const handleFacturaUpload = async (orderId, file) => {
    const formData = new FormData();
    formData.append('factura', file);

    try {
      setUploading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pedido/${orderId}/cargar_factura`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      const { factura_url } = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: 'Pedido Facturado', factura_url } : order
        )
      );
    } catch (error) {
      console.error('Error uploading factura:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDialog = (facturaUrl) => {
    setSelectedFacturaUrl(facturaUrl);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFacturaUrl(null);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ height: 'auto', width: '100%', padding: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox color="primary" />
                </StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Teléfono</StyledTableCell>
                <StyledTableCell>Fecha</StyledTableCell>
                <StyledTableCell>Productos</StyledTableCell>
                <StyledTableCell>Total</StyledTableCell>
                <StyledTableCell>Estado</StyledTableCell>
                <StyledTableCell>Comercial ID</StyledTableCell>
                <StyledTableCell>NIT</StyledTableCell>
                <StyledTableCell>Factura</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id} style={getRowStyle(row.estado)}>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.nombre_completo}</TableCell>
                  <TableCell>{row.numero_telefono}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>
                    <ProductosCell value={row.productos} row={row} onOpenDialog={onOpenProductosDialog} />
                  </TableCell>
                  <TableCell>{formatCurrency(row.total_venta)}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                  <TableCell>{row.comercial_id}</TableCell>
                  <TableCell>{row.nit || 'N/A'}</TableCell>
                  <TableCell>
                    {!row.factura_url ? (
                      <>
                        <input
                          accept="application/pdf,image/*"
                          style={{ display: 'none' }}
                          id={`factura-upload-${row.id}`}
                          type="file"
                          onChange={(e) => handleFacturaUpload(row.id, e.target.files[0])}
                        />
                        <label htmlFor={`factura-upload-${row.id}`}>
                          <IconButton component="span" disabled={uploading}>
                            <CloudUploadIcon />
                          </IconButton>
                        </label>
                      </>
                    ) : (
                      <IconButton onClick={() => handleOpenDialog(row.factura_url)}>
                        <VisibilityIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Factura
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
          {selectedFacturaUrl && (
            <iframe
              src={selectedFacturaUrl}
              width="100%"
              height="600px"
              title="Factura"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderTable;


