import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ClientTable = ({ clients, listasPrecios, estadisticasClientes, handlePedidosDialogOpen, handleOpen, handleDownload }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre Comercial</StyledTableCell>
            <StyledTableCell>Razón Social</StyledTableCell>
            <StyledTableCell>Teléfono</StyledTableCell>
            <StyledTableCell>Correo</StyledTableCell>
            <StyledTableCell>NIT/CC</StyledTableCell>
            <StyledTableCell>Días de Cartera</StyledTableCell>
            <StyledTableCell>Lista de Precios</StyledTableCell>
            <StyledTableCell>Dirección</StyledTableCell>
            <StyledTableCell>Ciudad</StyledTableCell>
            <StyledTableCell>Tipo Cliente</StyledTableCell>
            <StyledTableCell>Archivos</StyledTableCell>
            <StyledTableCell>Ticket Promedio</StyledTableCell>
            <StyledTableCell>Total Gastado</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <StyledTableRow
              key={client.id}
              onClick={() => handlePedidosDialogOpen(client)}
            >
              <TableCell>{client.nombre}</TableCell>
              <TableCell>{client.razon_social}</TableCell>
              <TableCell>{client.telefono}</TableCell>
              <TableCell>{client.correo}</TableCell>
              <TableCell>{client.nit || 'N/A'}</TableCell>
              <TableCell>{client.diasCartera || 'N/A'}</TableCell>
              <TableCell>
                {client.listaPreciosId
                  ? listasPrecios.find(
                      (lista) => lista.id === client.listaPreciosId
                    )?.nombre
                  : 'Ninguna'}
              </TableCell>
              <TableCell>{client.direccion || 'N/A'}</TableCell>
              <TableCell>{client.ciudad || 'N/A'}</TableCell>
              <TableCell>{client.tipo || 'N/A'}</TableCell>
              <TableCell>
                {client.rut ? (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(client.rut);
                    }}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell>
                {estadisticasClientes[client.id]
                  ? formatCurrency(
                      estadisticasClientes[client.id].ticket_promedio
                    )
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {estadisticasClientes[client.id]
                  ? formatCurrency(
                      estadisticasClientes[client.id].total_gastado
                    )
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(client);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientTable;
