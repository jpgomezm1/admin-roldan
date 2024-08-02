import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Stack, Button, Grid } from '@mui/material';
import OrderTable from './OrderTable';
import Modals from './Modals';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import AddOrderDialog from './AddOrderDialog';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const DeliveryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState('Todas');
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDate('Todas'); // Reset day selection when month changes
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = order.fecha_hora.split(' ')[0];
    const orderMonth = orderDate.split('-').slice(0, 2).join('-');
    const matchesMonth = selectedMonth === 'Todos' || orderMonth === selectedMonth;
    const matchesDate = selectedDate === 'Todas' || orderDate === selectedDate;
    return matchesMonth && matchesDate;
  });

  const transformOrders = filteredOrders
  .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)) // Orden descendente
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
      total: order.total_productos,
      comercial_id: order.comercial_id,
      nit: order.nit,
      total_venta: totalVenta,
      factura_url: order.factura_url // Añadir URL de factura aquí
    };
  });

  const totalVentas = transformOrders.reduce((sum, order) => sum + order.total_venta, 0);
  const totalVentasPagadas = transformOrders.filter(order => order.estado === 'Factura Pagada').reduce((sum, order) => sum + order.total_venta, 0);
  const totalVentasFacturadas = transformOrders.filter(order => order.estado === 'Pedido Facturado').reduce((sum, order) => sum + order.total_venta, 0);
  const totalVentasRecibidas = transformOrders.filter(order => order.estado === 'Pedido Recibido').reduce((sum, order) => sum + order.total_venta, 0);

  const getMonthName = (month) => {
    return dayjs(month + '-01').format('MMMM YYYY');
  };

  const uniqueMonths = ['Todos', ...Array.from(new Set(
    orders.map((order) => order.fecha_hora.split(' ')[0].split('-').slice(0, 2).join('-'))
  )).sort((a, b) => new Date(a) - new Date(b))].map((month) => ({
    value: month,
    label: month === 'Todos' ? 'Todos' : getMonthName(month)
  }));

  const uniqueDates = ['Todas', ...Array.from(new Set(
    orders
      .filter((order) => selectedMonth === 'Todos' || order.fecha_hora.split(' ')[0].startsWith(selectedMonth))
      .map((order) => order.fecha_hora.split(' ')[0])
  )).sort((a, b) => new Date(a) - new Date(b))];

  const handleOpenAddOrderDialog = () => {
    setOpenAddOrderDialog(true);
  };

  const handleCloseAddOrderDialog = () => {
    setOpenAddOrderDialog(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12}>
          <SummaryCard title="Total Ventas" value={totalVentas} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Ventas Factura Pagada" value={totalVentasPagadas} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Ventas Pedido Facturado" value={totalVentasFacturadas} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard title="Ventas Pedido Recibido" value={totalVentasRecibidas} />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Mes</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {uniqueMonths.map((month, index) => (
              <MenuItem key={index} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Día</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            disabled={selectedMonth === 'Todos'}
          >
            {uniqueDates.map((date, index) => (
              <MenuItem key={index} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrderTable
          orders={transformOrders}
          onEstadoChange={handleEstadoChange}
          onOpenProductosDialog={handleOpenProductosDialog}
          setOrders={setOrders} // Pasar setOrders al componente OrderTable
        />
      )}
      <Modals
        openProductos={openProductos}
        handleCloseProductosDialog={handleCloseProductosDialog}
        selectedProductos={selectedProductos}
        productsMap={productsMap}
      />
      <AddOrderDialog 
        open={openAddOrderDialog} 
        handleClose={handleCloseAddOrderDialog} 
        productsMap={productsMap}
        setOrders={setOrders} 
        token={token}  // Pasar el token al componente AddOrderDialog
      />
    </Box>
  );
};

export default DeliveryScreen;




