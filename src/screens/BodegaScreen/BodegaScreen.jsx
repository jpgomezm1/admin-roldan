import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import WineBarIcon from '@mui/icons-material/WineBar';
import { format } from 'date-fns';
import TotalPendientesPorDespacho from './TotalPendientesPorDespacho'; // Asegúrate de tener este archivo o ajusta la ruta según sea necesario

const BodegaScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroDia, setFiltroDia] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [responsable, setResponsable] = useState('');
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [showTotales, setShowTotales] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pedidos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            estado: 'Pedido Facturado',
          },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleEstadoEntrega = (pedido) => {
    setSelectedPedidoId(pedido.id);
    setSelectedPedido(pedido);
    setOpenDialog(true);
  };

  const handleConfirmEntrega = async () => {
    if (!responsable) {
      alert('El nombre del responsable es obligatorio.');
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/pedido/${selectedPedidoId}/estado_entrega`,
        { estado_entrega: 'Entregado', responsable },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === selectedPedidoId ? { ...pedido, estado_entrega: 'Entregado', responsable_entrega: responsable } : pedido
        )
      );

      setSnackbar({ open: true, message: response.data.mensaje, severity: 'success' });
      setOpenDialog(false);
      setResponsable('');
    } catch (error) {
      console.error('Error updating estado_entrega:', error);
      setSnackbar({ open: true, message: 'Error al actualizar el estado de entrega.', severity: 'error' });
    }
  };

  const handleFiltroChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  const handleFiltroMesChange = (event) => {
    setFiltroMes(event.target.value);
  };

  const handleFiltroDiaChange = (event) => {
    setFiltroDia(event.target.value);
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const pedidoDate = new Date(pedido.fecha_hora);
    const mesPedido = pedidoDate.getMonth() + 1;
    const diaPedido = pedidoDate.getDate();

    const matchEstado = filtroEstado ? pedido.estado_entrega === filtroEstado : true;
    const matchMes = filtroMes ? mesPedido === parseInt(filtroMes, 10) : true;
    const matchDia = filtroDia ? diaPedido === parseInt(filtroDia, 10) : true;

    return matchEstado && matchMes && matchDia;
  });

  const PedidoCard = ({ pedido }) => (
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: pedido.estado_entrega === 'Entregado' ? '#A5D6A7' : theme.palette.background.default,
          boxShadow: 4,
          position: 'relative',
          transition: 'background-color 0.3s ease',
          p: 3,
          border: '1px solid',
          borderColor: theme.palette.divider,
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Orden #{pedido.id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {format(new Date(pedido.fecha_hora), 'dd/MM/yyyy')}
              </Typography>
            </Box>
            <Tooltip title={pedido.estado_entrega === 'Pendiente' ? 'Marcar como Entregado' : 'Desmarcar Entrega'}>
              <IconButton
                sx={{
                  color: pedido.estado_entrega === 'Entregado' ? theme.palette.primary.main : theme.palette.success.main,
                  transition: 'color 0.3s ease',
                }}
                onClick={() => handleEstadoEntrega(pedido)}
              >
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
                Detalles del Pedido
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Nombre:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.nombre_completo}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dirección:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.direccion_cliente}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Contacto:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.numero_telefono}
                </Typography>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
            Productos:
          </Typography>
          <Box sx={{ maxHeight: 150, overflowY: 'auto', mt: 1, backgroundColor: '#f9f9f9', p: 2, borderRadius: 2 }}>
            {JSON.parse(pedido.productos).map((prod, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WineBarIcon fontSize="small" sx={{ mr: 1, color: '#5F54FB' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#5F54FB', flex: 1 }}>
                  {prod.name}
                </Typography>
                <Chip label={`x${prod.quantity}`} size="small" sx={{ fontWeight: 'bold', ml: 1 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Pedidos
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
        Filtra los pedidos por estado, mes y día para encontrar lo que buscas.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 4, mt: 4, gap: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 160 }}>
          <InputLabel id="filtro-estado-label">Estado de Entrega</InputLabel>
          <Select
            labelId="filtro-estado-label"
            value={filtroEstado}
            onChange={handleFiltroChange}
            label="Estado de Entrega"
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Entregado">Entregado</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="filtro-mes-label">Mes</InputLabel>
          <Select
            labelId="filtro-mes-label"
            value={filtroMes}
            onChange={handleFiltroMesChange}
            label="Mes"
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <MenuItem key={month} value={month}>
                {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 100 }}>
          <InputLabel id="filtro-dia-label">Día</InputLabel>
          <Select
            labelId="filtro-dia-label"
            value={filtroDia}
            onChange={handleFiltroDiaChange}
            label="Día"
            disabled={!filtroMes}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setShowTotales(true)} sx={{ textTransform: 'none', borderRadius: '20px', backgroundColor: '#5E54FC'}}>
          Resumen Total
        </Button>
      </Box>
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          pedidosFiltrados.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No hay pedidos actualmente.
              </Typography>
            </Box>
          ) : (
            pedidosFiltrados.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
          )
        )}
      </Grid>

      <TotalPendientesPorDespacho
        pedidos={pedidos}
        open={showTotales}
        onClose={() => setShowTotales(false)}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#5E55FE' }}>
          Confirmar Entrega de Pedido
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumen del Pedido
          </Typography>
          {selectedPedido && (
            <List dense>
              {JSON.parse(selectedPedido.productos).map((prod, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WineBarIcon sx={{ color: '#5E55FE' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${prod.name}`}
                    secondary={`Cantidad: ${prod.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <TextField
            margin="dense"
            label="Nombre del Responsable"
            type="text"
            fullWidth
            variant="outlined"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            sx={{ mt: 2 }}
            helperText="Ingrese el nombre del responsable de la entrega."
            error={!responsable}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'red', borderColor: 'red', borderRadius: '18px' }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmEntrega} variant="contained" sx={{ backgroundColor: '#5E55FE', borderRadius: '18px' }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BodegaScreen;
