import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import SalesChart from './charts/SalesChart';
import TransactionCountChart from './charts/TransactionCountChart';
import SalesDataViewer from './SalesDataViewer';
import SummaryKPI from './SummaryKPI';
import deliveryCosts from '../../data/barrios';

const DataScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get(`${apiBaseUrl}/pedidos`);
        console.log('Orders data:', ordersResponse.data); // <-- Verificar los datos aquí
        const filteredOrders = ordersResponse.data.filter(order => 
          order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Recibido'
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiBaseUrl]);

  return (
    <Box sx={{ p: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            Análisis de Datos
          </Typography>
          <SummaryKPI orders={orders} />
          <SalesChart orders={orders} deliveryCosts={deliveryCosts} />
          <TransactionCountChart orders={orders} />
          <SalesDataViewer orders={orders} />
        </>
      )}
    </Box>
  );
};

export default DataScreen;
