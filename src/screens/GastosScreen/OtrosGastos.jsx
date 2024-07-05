import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, IconButton, Paper, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddGastoDialog from './AddGastoDialog';
import KPICard from './components/KPICard';
import { styled } from '@mui/system';
import axios from 'axios';

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

const getStatusColor = (status) => {
  switch (status) {
    case 'Pago Pendiente por aprobacion':
      return 'orange';
    case 'Pago Aprobado':
      return 'green';
    case 'Pago Realizado':
      return 'blue';
    default:
      return 'grey';
  }
};

const OtrosGastos = () => {
  const [open, setOpen] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [editGasto, setEditGasto] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('Todos');
  const [tipoGastoSeleccionado, setTipoGastoSeleccionado] = useState('Todos');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');
  const [tiposDeGasto, setTiposDeGasto] = useState([]);
  const [viewAsTable, setViewAsTable] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedGastoId, setSelectedGastoId] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/gastos`);
      const gastosData = response.data;
      setGastos(gastosData);
      const tipos = ['Todos', ...new Set(gastosData.map(gasto => gasto.tipo_gasto))];
      setTiposDeGasto(tipos);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
    }
  };

  const handleOpen = () => {
    setEditGasto(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditGasto(null);
  };

  const handleSaveGasto = (gasto) => {
    if (editGasto) {
      setGastos(gastos.map(g => (g.id === gasto.id ? gasto : g)));
    } else {
      setGastos([...gastos, gasto]);
    }
  };

  const handleEditGasto = (gasto) => {
    setEditGasto(gasto);
    setOpen(true);
  };

  const handleDeleteGasto = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/gastos/${id}`);
      setGastos(gastos.filter(gasto => gasto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
    }
  };

  const handleApproveGasto = (gastoId) => {
    setSelectedGastoId(gastoId);
    setOpenPasswordDialog(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/gastos/${selectedGastoId}/aprobar`, { password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGastos(gastos.map(g => (g.id === selectedGastoId ? response.data : g)));
      setOpenPasswordDialog(false);
      setPassword('');
    } catch (error) {
      console.error('Error al aprobar el gasto:', error);
    }
  };

  const meses = ['Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filtrarGastosPorMes = (gastos, mes) => {
    if (mes === 'Todos') {
      return gastos;
    }
    const mesIndex = meses.indexOf(mes) - 1;
    return gastos.filter(gasto => new Date(gasto.fecha).getMonth() === mesIndex);
  };

  const filtrarGastosPorTipo = (gastos, tipo) => {
    if (tipo === 'Todos') {
      return gastos;
    }
    return gastos.filter(gasto => gasto.tipo_gasto === tipo);
  };

  const filtrarGastosPorEstado = (gastos, estado) => {
    if (estado === 'Todos') {
      return gastos;
    }
    return gastos.filter(gasto => gasto.status === estado);
  };

  const gastosFiltradosPorMes = filtrarGastosPorMes(gastos, mesSeleccionado);
  const gastosFiltradosPorTipo = filtrarGastosPorTipo(gastosFiltradosPorMes, tipoGastoSeleccionado);
  const gastosFiltrados = filtrarGastosPorEstado(gastosFiltradosPorTipo, estadoSeleccionado);

  const totalGastadoFiltrado = gastosFiltrados.reduce((acc, gasto) => acc + gasto.monto, 0);

  const renderGastosAsCards = () => (
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {gastosFiltrados.map((gasto, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: '10px', borderLeft: `5px solid ${getStatusColor(gasto.status)}` }}>
            <Typography variant="h6" sx={{ color: '#5E55FE', fontWeight: 'bold', mb: 1 }}>{gasto.tipo_gasto}</Typography>
            <Typography variant="body2" color="textSecondary">{gasto.descripcion}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Monto: {formatCurrency(gasto.monto)}</Typography>
            <Typography variant="body2" color="textSecondary">Fecha: {gasto.fecha}</Typography>
            <Typography variant="body2" color={getStatusColor(gasto.status)}>Estado: {gasto.status}</Typography>
            {gasto.soporte_url && (
              <Typography variant="body2" color="primary">
                <a href={gasto.soporte_url} target="_blank" rel="noopener noreferrer">Ver Soporte</a>
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              {gasto.status === 'Pago Pendiente por aprobacion' && (
                <Button 
                  variant="text" 
                  onClick={() => handleApproveGasto(gasto.id)}
                  sx={{ 
                    color: getStatusColor(gasto.status), 
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    padding: '6px 12px',
                    fontSize: '0.875rem'
                  }}
                >
                  Aprobar Pago
                </Button>
              )}
              <Box>
                <IconButton onClick={() => handleEditGasto(gasto)} sx={{ color: '#5E55FE' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteGasto(gasto.id)} sx={{ color: '#5E55FE' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderGastosAsTable = () => (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Tipo de Gasto</StyledTableCell>
            <StyledTableCell>Descripción</StyledTableCell>
            <StyledTableCell>Monto</StyledTableCell>
            <StyledTableCell>Fecha</StyledTableCell>
            <StyledTableCell>Estado</StyledTableCell>
            <StyledTableCell>Soporte</StyledTableCell>
            <StyledTableCell align="right">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gastosFiltrados.map((gasto) => (
            <TableRow key={gasto.id}>
              <TableCell>{gasto.tipo_gasto}</TableCell>
              <TableCell>{gasto.descripcion}</TableCell>
              <TableCell>{formatCurrency(gasto.monto)}</TableCell>
              <TableCell>{gasto.fecha}</TableCell>
              <TableCell>
                <Typography variant="body2" color={getStatusColor(gasto.status)}>{gasto.status}</Typography>
              </TableCell>
              <TableCell>
                {gasto.soporte_url && (
                  <a href={gasto.soporte_url} target="_blank" rel="noopener noreferrer">Ver Soporte</a>
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditGasto(gasto)} sx={{ color: '#5E55FE' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteGasto(gasto.id)} sx={{ color: '#5E55FE' }}>
                  <DeleteIcon />
                </IconButton>
                {gasto.status === 'Pago Pendiente por aprobacion' && (
                  <Button 
                    variant="contained" 
                    onClick={() => handleApproveGasto(gasto.id)}
                    sx={{ 
                      backgroundColor: getStatusColor(gasto.status), 
                      color: 'white', 
                      '&:hover': { backgroundColor: getStatusColor(gasto.status) },
                      borderRadius: '8px',
                      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                    }}
                  >
                    Aprobar Pago
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ color: '#5E55FE', fontWeight: 'bold' }}>Otros Gastos</Typography>
      <KPICard title="Total Gastos" value={formatCurrency(totalGastadoFiltrado)} />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar Gasto
          </Button>
        </Grid>
        <Grid item>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="mes-select-label">Mes</InputLabel>
            <Select
              labelId="mes-select-label"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              label="Mes"
            >
              {meses.map((mes, index) => (
                <MenuItem key={index} value={mes}>{mes}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="tipo-gasto-select-label">Tipo de Gasto</InputLabel>
            <Select
              labelId="tipo-gasto-select-label"
              value={tipoGastoSeleccionado}
              onChange={(e) => setTipoGastoSeleccionado(e.target.value)}
              label="Tipo de Gasto"
            >
              {tiposDeGasto.map((tipo, index) => (
                <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="estado-select-label">Estado</InputLabel>
            <Select
              labelId="estado-select-label"
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              label="Estado"
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Pago Pendiente por aprobacion">Pago Pendiente por aprobacion</MenuItem>
              <MenuItem value="Pago Aprobado">Pago Aprobado</MenuItem>
              <MenuItem value="Pago Realizado">Pago Realizado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={viewAsTable}
                onChange={() => setViewAsTable(!viewAsTable)}
                color="primary"
              />
            }
            label="Ver como tabla"
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      {viewAsTable ? renderGastosAsTable() : renderGastosAsCards()}
      <AddGastoDialog
        open={open}
        handleClose={handleClose}
        handleSaveGasto={handleSaveGasto}
        gasto={editGasto}
      />
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5E55FE' }}>Confirmar Aprobación</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#333' }}>
            ¿Deseas aprobar este pago?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: '#555' }}>
            Administrador: <strong>Laura Roldan</strong>
          </Typography>
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button onClick={() => setOpenPasswordDialog(false)} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
          <Button 
            onClick={handlePasswordSubmit} 
            variant="contained" 
            sx={{ 
              backgroundColor: '#5E55FE', 
              color: 'white', 
              borderRadius: '8px', 
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#7b45a1' }
            }}
          >
            Aprobar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OtrosGastos;
