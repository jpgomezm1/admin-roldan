import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Stack, Grid } from '@mui/material';
import OrderTableCartera from './OrderTableCartera';
import Modals from '../DeliveryScreen/Modals';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const CarteraScreen = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/pedidos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/productos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const productsMap = productsResponse.data.reduce((acc, product) => {
          acc[product.id] = product.nombre;
          return acc;
        }, {});
        setProductsMap(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, [token]);

  const handleOpenProductosDialog = (productosDetalles) => {
    setSelectedProductos(productosDetalles);
    setOpenProductos(true);
  };

  const handleCloseProductosDialog = () => {
    setOpenProductos(false);
    setSelectedProductos([]);
  };

  const handleEstadoChange = async (orderId, newEstado) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/pedido/${orderId}/estado`, { estado: newEstado }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: newEstado } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleEstadoFilterChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const calculateDiasParaVencimiento = (fechaPedido, diasCartera) => {
    const fechaPedidoObj = dayjs(fechaPedido);
    const today = dayjs();
    const diasTranscurridos = today.diff(fechaPedidoObj, 'day');
    return diasCartera - diasTranscurridos;
  };

  const filteredOrders = orders.filter(order => {
    const isMatchingDate = selectedDate === 'Todas' || order.fecha_hora.split(' ')[0] === selectedDate;
    const isMatchingEstado = selectedEstado === 'Todos' || order.estado === selectedEstado;
    return isMatchingDate && isMatchingEstado;
  });

  const transformOrders = filteredOrders
  .map((order) => {
    const productos = JSON.parse(order.productos);
    const productosDescripcion = productos
      .map((prod) => `${productsMap[prod.id]} (x${prod.quantity})`)
      .join(', ');

    const totalVenta = order.total_con_descuento || order.total_productos;

    return {
      id: order.id,
      nombre_completo: order.nombre_completo,
      numero_telefono: order.numero_telefono,
      direccion: order.direccion,
      fecha: order.fecha_hora,
      productos: productosDescripcion,
      productosDetalles: productos,
      estado: order.estado,
      total: order.total_con_descuento || order.total_productos,
      comercial_id: order.comercial_id,
      nit: order.nit,
      total_venta: totalVenta,
      factura_url: order.factura_url,
      recibo_url: order.recibo_url,
      diasCartera: calculateDiasParaVencimiento(order.fecha_hora, order.diasCartera)
    };
  })
  .sort((a, b) => {
    // Priorizar por estado primero para asegurar que los pagados estén al final
    if (a.estado === 'Factura Pagada' && b.estado !== 'Factura Pagada') return 1;
    if (a.estado !== 'Factura Pagada' && b.estado === 'Factura Pagada') return -1;

    // Ordenar por días de vencimiento en orden ascendente (los más vencidos primero, incluso si son negativos)
    return a.diasCartera - b.diasCartera;
  });

  const uniqueDates = ['Todas', ...Array.from(new Set(
    orders.map((order) => order.fecha_hora.split(' ')[0])
  )).sort((a, b) => new Date(a) - new Date(b))];

  const uniqueEstados = ['Todos', ...Array.from(new Set(
    orders.map((order) => order.estado)
  ))];

  const carteraProximaAVencer = transformOrders
    .filter(order => order.estado === 'Pedido Facturado' && calculateDiasParaVencimiento(order.fecha, order.diasCartera) >= 0 && calculateDiasParaVencimiento(order.fecha, order.diasCartera) <= 5)
    .reduce((acc, order) => acc + order.total_venta, 0);

  const carteraVencida = transformOrders
    .filter(order => order.estado === 'Pedido Facturado' && calculateDiasParaVencimiento(order.fecha, order.diasCartera) < 0)
    .reduce((acc, order) => acc + order.total_venta, 0);

  const carteraPagada = transformOrders
    .filter(order => order.estado === 'Factura Pagada')
    .reduce((acc, order) => acc + order.total_venta, 0);

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Fecha</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
          >
            {uniqueDates.map((date, index) => (
              <MenuItem key={index} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Estado</InputLabel>
          <Select
            value={selectedEstado}
            onChange={handleEstadoFilterChange}
          >
            {uniqueEstados.map((estado, index) => (
              <MenuItem key={index} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Cartera Próxima a Vencer" value={carteraProximaAVencer} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Cartera Vencida" value={carteraVencida} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Cartera Pagada" value={carteraPagada} />
        </Grid>
      </Grid>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrderTableCartera
          orders={transformOrders}
          onEstadoChange={handleEstadoChange}
          onOpenProductosDialog={handleOpenProductosDialog}
          setOrders={setOrders}
        />
      )}
      <Modals
        openProductos={openProductos}
        handleCloseProductosDialog={handleCloseProductosDialog}
        selectedProductos={selectedProductos}
        productsMap={productsMap}
      />
    </Box>
  );
};

export default CarteraScreen;


