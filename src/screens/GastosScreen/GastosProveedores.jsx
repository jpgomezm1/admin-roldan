import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, CircularProgress, Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Box, Grid, Divider, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import KPICard from './components/KPICard';
import dayjs from 'dayjs';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CustomCard = styled(Card)(({ theme }) => ({
  border: '1px solid black',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
}));

function GastosProveedores() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [totalGastado, setTotalGastado] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/pedidos_proveedores`);
      setPedidos(response.data);

      // Calcular el total gastado
      const total = response.data.reduce((acc, pedido) => acc + pedido.total_costo, 0);
      setTotalGastado(total);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
    }
    setLoading(false);
  };

  const handleExpandClick = (pedidoId) => {
    setExpanded((prevExpanded) => (prevExpanded === pedidoId ? false : pedidoId));
  };

  const handleUpdateEstado = async (pedidoId) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/pedidos_proveedores/${pedidoId}`, { estado: 'Pedido Recibido' });
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: response.data.estado } : pedido
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado del pedido', error);
    }
  };

  const handleDeletePedido = async (pedidoId) => {
    try {
      await axios.delete(`${apiBaseUrl}/pedidos_proveedores/${pedidoId}`);
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
    } catch (error) {
      console.error('Error al eliminar el pedido', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterPedidosByMonth = (pedidos, month) => {
    if (month === 'Todos') {
      return pedidos;
    }
    return pedidos.filter((pedido) => dayjs(pedido.fecha_hora).month() + 1 === month);
  };

  const filteredPedidos = filterPedidosByMonth(pedidos, selectedMonth);
  const totalFilteredGastado = filteredPedidos.reduce((acc, pedido) => acc + pedido.total_costo, 0);

  return (
    <Container>
      <Typography variant="h5" sx={{ color: '#5E55FE', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Gastos en Proveedores
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <KPICard title="Total Gastado" value={formatCurrency(totalFilteredGastado)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <KPICard title="Pedidos Realizados" value={filteredPedidos.length} />
        </Grid>
      </Grid>

      <FormControl sx={{ mb: 4 }}>
        <InputLabel id="mes-label">Mes</InputLabel>
        <Select
          labelId="mes-label"
          value={selectedMonth}
          onChange={handleMonthChange}
          label="Mes"
        >
          <MenuItem value="Todos">Todos</MenuItem>
          {Array.from({ length: 12 }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {dayjs().month(index).format('MMMM')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredPedidos.map((pedido) => (
            <Grid item xs={12} sm={6} md={4} key={pedido.id}>
              <CustomCard>
                <CardHeader
                  title={`Pedido ID: ${pedido.id}`}
                  subheader={`Total: ${formatCurrency(pedido.total_costo)}`}
                  action={
                    <IconButton onClick={() => handleDeletePedido(pedido.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {pedido.fecha_hora}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Estado: {pedido.estado}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Typography variant="button">Detalles</Typography>
                  <ExpandMore
                    expand={expanded === pedido.id}
                    onClick={() => handleExpandClick(pedido.id)}
                    aria-expanded={expanded === pedido.id}
                    aria-label="mostrar más"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                  {pedido.estado !== 'Pedido Recibido' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateEstado(pedido.id)}
                      sx={{ ml: 2 }}
                    >
                      Recibido
                    </Button>
                  )}
                </CardActions>
                <Collapse in={expanded === pedido.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Detalles del Pedido:</Typography>
                    {pedido.detalles.map((detalle) => (
                      <Box key={detalle.id} sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          {`${detalle.producto.nombre} - Proveedor: ${detalle.producto.proveedor.nombre} - Cantidad: ${detalle.cantidad} ${detalle.producto.unidad} - Total: ${formatCurrency(detalle.costo_total)}`}
                        </Typography>
                        <Divider />
                      </Box>
                    ))}
                  </CardContent>
                </Collapse>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default GastosProveedores;


