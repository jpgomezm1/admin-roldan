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
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import WineBarIcon from '@mui/icons-material/WineBar';
import { format } from 'date-fns';

const BodegaScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Pendiente');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [responsable, setResponsable] = useState('');
  const [selectedPedido, setSelectedPedido] = useState(null);
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
          },
        }
      );

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === selectedPedidoId ? { ...pedido, estado_entrega: 'Entregado', responsable_entrega: responsable } : pedido
        )
      );

      alert(response.data.mensaje);
      setOpenDialog(false);
      setResponsable('');
    } catch (error) {
      console.error('Error updating estado_entrega:', error);
    }
  };

  const handleFiltroChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  const pedidosFiltrados = filtroEstado
    ? pedidos.filter((pedido) => pedido.estado_entrega === filtroEstado)
    : pedidos;

  const PedidoCard = ({ pedido }) => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: pedido.estado_entrega === 'Entregado' ? '#A5D6A7' : theme.palette.background.default,
          boxShadow: 4,
          position: 'relative',
          transition: 'background-color 0.3s ease',
          p: 3,
          border: '1px solid black',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Orden #{pedido.id}
            </Typography>
            <Typography variant="body2">
              {format(new Date(pedido.fecha_hora), 'dd/MM/yyyy')}
            </Typography>
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
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            {pedido.nombre_completo}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Dirección: {pedido.direccion_cliente}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Contacto: {pedido.numero_telefono}
          </Typography>
          {pedido.estado_entrega === 'Entregado' && (
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Responsable: {pedido.responsable_entrega}
            </Typography>
          )}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="textSecondary">
            Productos:
          </Typography>
          <Box sx={{ maxHeight: 150, overflowY: 'auto', mt: 1 }}>
            {JSON.parse(pedido.productos).map((prod, index) => (
              <Typography variant="body2" key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <WineBarIcon fontSize="small" sx={{ mr: 1, color: '#5F54FB' }} />
                {prod.name} <Chip label={`x${prod.quantity}`} size="small" sx={{ ml: 1 }} />
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <FormControl variant="outlined" sx={{ mb: 3, minWidth: 200 }}>
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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {pedidosFiltrados.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No hay pedidos actualmente.
              </Typography>
            </Box>
          ) : (
            pedidosFiltrados.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
          )}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#5E55FE'}}>
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
                    <WineBarIcon sx={{ color: '#5E55FE'}} />
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
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'red', borderColor: 'red', borderRadius: '18px'}}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmEntrega} variant="contained" sx={{ backgroundColor: '#5E55FE', borderRadius: '18px'}}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BodegaScreen;

