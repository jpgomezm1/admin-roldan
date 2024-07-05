import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, CircularProgress, Card, CardHeader, CardContent, CardActions, Collapse, IconButton, Box, Grid, Divider, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

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

function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/pedidos_proveedores`);
      setPedidos(response.data);
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
        Pedidos Realizados
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {pedidos.map((pedido) => (
            <Grid item xs={12} sm={6} md={4} key={pedido.id}>
              <CustomCard>
                <CardHeader
                  title={`Pedido ID: ${pedido.id}`}
                  subheader={`Total: ${formatCurrency(pedido.total_costo)}`}
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
                          {`${detalle.producto.nombre} - Cantidad: ${detalle.cantidad} ${detalle.producto.unidad} - Total: ${formatCurrency(detalle.costo_total)}`}
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

export default PedidosList;

