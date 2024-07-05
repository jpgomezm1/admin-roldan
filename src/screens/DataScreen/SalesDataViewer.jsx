import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, Typography, Checkbox, FormControlLabel, Grid } from '@mui/material';
import SalesPieChart from './charts/SalesPieChart';
import ProductSalesCountPieChart from './charts/ProductSalesCountPieChart';

const SalesDataViewer = ({ orders }) => {
  const [viewType, setViewType] = useState('Anual');
  const [selectedDate, setSelectedDate] = useState('');
  const [generalView, setGeneralView] = useState(true);  // Inicializado en true

  const filteredOrders = orders.filter(order =>
    order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Enviado'
  );

  const getGroupedOrders = () => {
    const grouped = {};
    filteredOrders.forEach(order => {
      const date = order.fecha_hora.split(' ')[0];
      const year = date.slice(0, 4);
      const month = date.slice(0, 7);
      const week = getWeekRange(date);
      const day = date;

      const period = viewType === 'Anual' ? year :
                     viewType === 'Mensual' ? month :
                     viewType === 'Semanal' ? week : day;

      if (grouped[period]) {
        grouped[period].push(order);
      } else {
        grouped[period] = [order];
      }
    });

    return grouped;
  };

  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    const endOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 7));
    return `${startOfWeek.toLocaleDateString('es-ES')} - ${endOfWeek.toLocaleDateString('es-ES')}`;
  };

  const groupedOrders = getGroupedOrders();

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
      setSelectedDate(''); // Reset selected date
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleGeneralViewChange = (event) => {
    setGeneralView(event.target.checked);
  };

  const uniqueDates = Object.keys(groupedOrders).sort();

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <FormControlLabel
          control={<Checkbox checked={generalView} onChange={handleGeneralViewChange} />}
          label="General"
        />
      </Box>

      {!generalView && (
        <>
          <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewTypeChange}
            >
              <ToggleButton value="Anual">Anual</ToggleButton>
              <ToggleButton value="Mensual">Mensual</ToggleButton>
              <ToggleButton value="Semanal">Semanal</ToggleButton>
              <ToggleButton value="Diario">Diario</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ maxWidth: 300, mb: 2 }}>
            <FormControl margin="normal" sx={{ width: '100%', mb: 2 }}>
              <InputLabel id="date-select-label">Seleccionar {viewType}</InputLabel>
              <Select
                labelId="date-select-label"
                id="date-select"
                value={selectedDate}
                label={`Seleccionar ${viewType}`}
                onChange={handleDateChange}
              >
                {uniqueDates.map(date => (
                  <MenuItem key={date} value={date}>
                    {date}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SalesPieChart orders={generalView ? filteredOrders : (groupedOrders[selectedDate] || [])} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProductSalesCountPieChart orders={generalView ? filteredOrders : (groupedOrders[selectedDate] || [])} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesDataViewer;
