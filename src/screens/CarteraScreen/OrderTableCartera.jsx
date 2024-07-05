import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Box, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ProductosCell from '../DeliveryScreen/ProductosCell';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';

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

const calculateDiasParaVencimiento = (fechaPedido, diasCartera) => {
  const fechaPedidoObj = dayjs(fechaPedido);
  const today = dayjs();
  const diasTranscurridos = today.diff(fechaPedidoObj, 'day');
  return diasCartera - diasTranscurridos;
};

const OrderTableCartera = ({ orders, onOpenProductosDialog, setOrders }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFacturaUrl, setSelectedFacturaUrl] = useState(null);
  const [selectedReciboUrl, setSelectedReciboUrl] = useState(null);
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

  const handleReciboUpload = async (orderId, file) => {
    const formData = new FormData();
    formData.append('recibo', file);

    try {
      setUploading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pedido/${orderId}/cargar_recibo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      const { recibo_url } = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: 'Factura Pagada', recibo_url } : order
        )
      );
    } catch (error) {
      console.error('Error uploading recibo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenDialog = (url, type) => {
    if (type === 'factura') {
      setSelectedFacturaUrl(url);
    } else if (type === 'recibo') {
      setSelectedReciboUrl(url);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFacturaUrl(null);
    setSelectedReciboUrl(null);
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
                <StyledTableCell>Días Vencimiento</StyledTableCell>
                <StyledTableCell>Factura</StyledTableCell>
                <StyledTableCell>Recibo</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => {
                const diasParaVencimiento = calculateDiasParaVencimiento(row.fecha, row.diasCartera);
                let Icon;
                if (diasParaVencimiento > 5) {
                  Icon = <CheckCircleIcon style={{ color: 'green' }} />;
                } else if (diasParaVencimiento >= 0) {
                  Icon = <WarningIcon style={{ color: 'orange' }} />;
                } else {
                  Icon = <ErrorIcon style={{ color: 'red' }} />;
                }

                return (
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
                    <TableCell>{formatCurrency(row.total_con_descuento || row.total_venta)}</TableCell>
                    <TableCell>{row.estado}</TableCell>
                    <TableCell>{row.comercial_id}</TableCell>
                    <TableCell>{row.nit || 'N/A'}</TableCell>
                    <TableCell>
                      {row.estado === 'Factura Pagada' ? (
                        <CheckCircleIcon style={{ color: 'green' }} />
                      ) : (
                        <Box display="flex" alignItems="center">
                          <span>{diasParaVencimiento} días</span> {Icon}
                        </Box>
                      )}
                    </TableCell>
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
                        <IconButton onClick={() => handleOpenDialog(row.factura_url, 'factura')}>
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      {!row.recibo_url ? (
                        <>
                          <input
                            accept="application/pdf,image/*"
                            style={{ display: 'none' }}
                            id={`recibo-upload-${row.id}`}
                            type="file"
                            onChange={(e) => handleReciboUpload(row.id, e.target.files[0])}
                          />
                          <label htmlFor={`recibo-upload-${row.id}`}>
                            <IconButton component="span" disabled={uploading}>
                              <CloudUploadIcon />
                            </IconButton>
                          </label>
                        </>
                      ) : (
                        <IconButton onClick={() => handleOpenDialog(row.recibo_url, 'recibo')}>
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedFacturaUrl ? 'Factura' : 'Recibo'}
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
          {selectedReciboUrl && (
            <iframe
              src={selectedReciboUrl}
              width="100%"
              height="600px"
              title="Recibo"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderTableCartera;



