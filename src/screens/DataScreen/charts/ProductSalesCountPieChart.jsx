import React from 'react';
import Plot from 'react-plotly.js';
import { Typography } from '@mui/material';

const ProductSalesCountPieChart = ({ orders }) => {
  const productSalesCount = {};

  orders.forEach(order => {
    try {
      const productos = JSON.parse(order.productos);
      productos.forEach(product => {
        const productName = product.name || product.id;
        const quantity = product.quantity || 1;

        if (productSalesCount[productName]) {
          productSalesCount[productName] += quantity;
        } else {
          productSalesCount[productName] = quantity;
        }
      });
    } catch (error) {
      console.error('Error parsing products:', error);
    }
  });

  const data = [{
    type: 'pie',
    values: Object.values(productSalesCount),
    labels: Object.keys(productSalesCount),
    textinfo: 'percent',
    insidetextorientation: 'radial',
    marker: {
      colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24'],
    },
    hoverinfo: 'label+value'
  }];

  const layout = {
    font: {
      family: 'Poppins',
    },
    height: 600,
    width: 700,
    paper_bgcolor: '#f8f9fa',
    plot_bgcolor: '#f8f9fa',
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.1
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Cantidad de Ventas por Producto
      </Typography>
      <Plot data={data} layout={layout} />
    </>
  );
};

export default ProductSalesCountPieChart;
