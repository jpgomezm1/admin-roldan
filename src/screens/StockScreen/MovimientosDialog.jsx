import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Paper, IconButton, Box, TableContainer,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as XLSX from 'xlsx';

dayjs.locale('es');  // Configurar dayjs para usar español

const StyledDialogTitle = styled(DialogTitle)({
  color: "#5A67D8",
  fontWeight: 'bold'
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const MovimientosDialog = ({ open, handleClose }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [mesFiltro, setMesFiltro] = useState(dayjs().format('YYYY-MM')); // Mes actual preseleccionado
  const [mesesDisponibles, setMesesDisponibles] = useState([]);

  useEffect(() => {
    if (open) {
      fetchMovimientos();
    }
  }, [open]);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/inventarios/movimientos`);
      setMovimientos(response.data);
      const meses = [...new Set(response.data.map(movimiento => dayjs(movimiento.fecha_hora).format('YYYY-MM')))];
      setMesesDisponibles(meses);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los movimientos de inventario', error);
      setLoading(false);
    }
  };

  const handleTipoFiltroChange = (event) => {
    setTipoFiltro(event.target.value);
  };

  const handleMesFiltroChange = (event) => {
    setMesFiltro(event.target.value);
  };

  const movimientosFiltrados = movimientos.filter(movimiento => {
    const coincideTipo = tipoFiltro ? movimiento.tipo === tipoFiltro : true;
    const coincideMes = mesFiltro ? dayjs(movimiento.fecha_hora).format('YYYY-MM') === mesFiltro : true;
    return coincideTipo && coincideMes;
  });

  const descargarExcel = () => {
    const data = movimientosFiltrados.map(movimiento => ({
      Producto: movimiento.producto.nombre,
      Tipo: movimiento.tipo,
      Cantidad: movimiento.cantidad,
      Anotación: movimiento.comentario,
      Fecha: dayjs(movimiento.fecha_hora).format('DD MMMM YYYY'),
      BodegaOrigen: movimiento.bodega_origen || '-',
      BodegaDestino: movimiento.bodega_destino || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");
    XLSX.writeFile(workbook, `Movimientos_Inventario_${dayjs().format('YYYYMMDD')}.xlsx`);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Movimientos de Inventario
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="tipo-filtro-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-filtro-label"
                  value={tipoFiltro}
                  label="Tipo"
                  onChange={handleTipoFiltroChange}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  <MenuItem value='entrada'>Entrada</MenuItem>
                  <MenuItem value='salida'>Salida</MenuItem>
                  <MenuItem value='traslado'>Traslado</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="mes-filtro-label">Mes</InputLabel>
                <Select
                  labelId="mes-filtro-label"
                  value={mesFiltro}
                  label="Mes"
                  onChange={handleMesFiltroChange}
                >
                  <MenuItem value=''>Todos</MenuItem>
                  {mesesDisponibles.map(mes => (
                    <MenuItem key={mes} value={mes}>{dayjs(mes).format('MMMM YYYY')}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Producto</StyledTableCell>
                    <StyledTableCell>Tipo</StyledTableCell>
                    <StyledTableCell>Cantidad</StyledTableCell>
                    <StyledTableCell>Anotación</StyledTableCell>
                    <StyledTableCell>Fecha</StyledTableCell>
                    <StyledTableCell>Bodega Origen</StyledTableCell>
                    <StyledTableCell>Bodega Destino</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movimientosFiltrados.map(movimiento => (
                    <TableRow key={movimiento.id}>
                      <TableCell>{movimiento.producto.nombre}</TableCell>
                      <TableCell>{movimiento.tipo}</TableCell>
                      <TableCell>{movimiento.cantidad}</TableCell>
                      <TableCell>{movimiento.comentario}</TableCell>
                      <TableCell>{dayjs(movimiento.fecha_hora).format('DD MMMM YYYY')}</TableCell>
                      <TableCell>{movimiento.bodega_origen || '-'}</TableCell>
                      <TableCell>{movimiento.bodega_destino || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={descargarExcel} style={{ marginTop: '20px', backgroundColor: '#0CC143', textTransform: 'none' }}>
              Descargar Excel
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovimientosDialog;

