import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

const TransactionCountChart = ({ orders }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewType, setViewType] = useState('Mensual');

  const filteredOrders = orders.filter(order =>
    order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Enviado'
  );

  const groupTransactions = () => {
    const grouped = {};
    filteredOrders.forEach(order => {
      const date = order.fecha_hora.split(' ')[0];
      const period = viewType === 'Diario' ? date : date.slice(0, 7);

      if (grouped[period]) {
        grouped[period] += 1;
      } else {
        grouped[period] = 1;
      }
    });
    return grouped;
  };

  const filteredTransactions = viewType === 'Diario'
    ? Object.entries(groupTransactions()).reduce((acc, [date, count]) => {
        if (date.startsWith(selectedMonth)) {
          acc[date] = count;
        }
        return acc;
      }, {})
    : Object.entries(groupTransactions()).reduce((acc, [date, count]) => {
        if (date.startsWith(selectedYear)) {
          acc[date] = (acc[date] || 0) + count;
        }
        return acc;
      }, {});

  const data = [{
    type: 'bar',
    x: Object.keys(filteredTransactions),
    y: Object.values(filteredTransactions),
    marker: {
      color: '#EFE8DD'
    },
    hoverinfo: 'x+y',
    hovertemplate: '%{x}<br>%{y}<extra></extra>',
  }];

  const annotations = Object.entries(filteredTransactions).map(([key, value]) => ({
    x: key,
    y: value,
    text: `${value}`,
    xanchor: 'center',
    yanchor: 'bottom',
    showarrow: false,
    font: {
      family: 'Poppins',
      size: 15,
      color: 'black',
      weight: 'bold',
    },
  }));

  const layout = {
    font: {
      family: 'Poppins',
    },
    width: 1400,
    height: 600,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    },
    paper_bgcolor: '#f8f9fa',
    plot_bgcolor: '#f8f9fa',
    showlegend: false,
    annotations: annotations,
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const uniqueMonths = Array.from(new Set(orders.map(order => order.fecha_hora.slice(0, 7)))).sort();
  const uniqueYears = Array.from(new Set(orders.map(order => order.fecha_hora.slice(0, 4)))).sort();

  const getLocaleDateString = (dateString) => {
    const [year, month] = dateString.split("-");
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Cantidad de transacciones por fecha
      </Typography>

      <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewTypeChange}
        >
          <ToggleButton value="Diario">Diario</ToggleButton>
          <ToggleButton value="Mensual">Mensual</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewType === 'Diario' ? (
        <Box sx={{ maxWidth: 300, mb: 2 }}>
          <FormControl margin="normal" sx={{ width: '60%', mb: 2 }}>
            <InputLabel id="month-select-label">Mes</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Mes"
              onChange={handleMonthChange}
            >
              {uniqueMonths.map(month => (
                <MenuItem key={month} value={month}>
                  {getLocaleDateString(month)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 300, mb: 2 }}>
          <FormControl margin="normal" sx={{ width: '60%', mb: 2 }}>
            <InputLabel id="year-select-label">Año</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Año"
              onChange={handleYearChange}
            >
              {uniqueYears.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Plot data={data} layout={layout} />
    </Box>
  );
};

export default TransactionCountChart;
