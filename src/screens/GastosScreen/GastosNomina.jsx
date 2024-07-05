import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControlLabel, Switch, MenuItem, Select, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KPICard from './components/KPICard';
import dayjs from 'dayjs';

const GastosNomina = () => {
  const [open, setOpen] = useState(false);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [salario, setSalario] = useState('');
  const [fechaContratacion, setFechaContratacion] = useState('');
  const [rol, setRol] = useState('');
  const [activo, setActivo] = useState(true);
  const [fechaTerminacion, setFechaTerminacion] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [horasTrabajadas, setHorasTrabajadas] = useState({});
  const [inputHoras, setInputHoras] = useState('');

  const auxilioTransporte = 140000; // Auxilio de transporte 2024
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/empleados`)
      .then(response => {
        setEmpleados(response.data);
      })
      .catch(error => {
        console.error('Error fetching empleados:', error);
      });

    axios.get(`${apiBaseUrl}/horas_trabajadas`)
      .then(response => {
        const horasTrabajadas = response.data.reduce((acc, curr) => {
          acc[`${curr.empleado_id}-${curr.mes}`] = curr.horas;
          return acc;
        }, {});
        setHorasTrabajadas(horasTrabajadas);
      })
      .catch(error => {
        console.error('Error fetching horas trabajadas:', error);
      });
  }, [apiBaseUrl]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNombre('');
    setSalario('');
    setFechaContratacion('');
    setRol('');
    setActivo(true);
    setFechaTerminacion('');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calcularCostoReal = (salarioBase) => {
    const SB = parseFloat(salarioBase);
    const AT = SB < 2 * 1160000 ? auxilioTransporte : 0; // Salario mínimo 2024 estimado en 1,160,000 COP
    const TR = 0.0052; // Tasa de riesgo mínima

    const prestacionesSociales = (SB + AT) * 0.2183;
    const seguridadSocial = SB * (0.205 + TR);
    const parafiscales = SB * 0.09;

    const costoTotalMensual = SB + prestacionesSociales + seguridadSocial + parafiscales;
    return {
      total: costoTotalMensual.toFixed(2),
      prestacionesSociales: prestacionesSociales.toFixed(2),
      seguridadSocial: seguridadSocial.toFixed(2),
      parafiscales: parafiscales.toFixed(2),
      auxilioTransporte: AT
    };
  };

  const handleSaveEmpleado = async () => {
    const costoReal = calcularCostoReal(salario);
    const newEmpleado = {
      nombre,
      salario: parseFloat(salario),
      fecha_contratacion: fechaContratacion,
      rol,
      activo,
      fecha_terminacion: activo ? null : fechaTerminacion,
      costo_real: costoReal.total,
      desglose_costo: costoReal
    };

    try {
      await axios.post(`${apiBaseUrl}/empleados`, newEmpleado);
      setEmpleados([...empleados, newEmpleado]);
      handleClose();
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  const handleOpenDetalle = (empleado) => {
    setSelectedEmpleado(empleado);
    setInputHoras(horasTrabajadas[`${empleado.id}-${selectedMonth}`] || 160);
    setDetalleOpen(true);
  };

  const handleCloseDetalle = () => {
    setSelectedEmpleado(null);
    setDetalleOpen(false);
  };

  const handleHorasChange = (event) => {
    setInputHoras(event.target.value);
  };

  const handleSaveHoras = () => {
    const newHorasTrabajadas = {
      empleado_id: selectedEmpleado.id,
      mes: selectedMonth,
      año: dayjs().year(),
      horas: inputHoras
    };
    axios.post(`${apiBaseUrl}/horas_trabajadas`, newHorasTrabajadas)
      .then(response => {
        setHorasTrabajadas({
          ...horasTrabajadas,
          [`${selectedEmpleado.id}-${selectedMonth}`]: response.data.horas
        });
        handleCloseDetalle();
      })
      .catch(error => {
        console.error('Error saving horas trabajadas:', error);
      });
  };

  const filtrarGastoPorMes = (mes) => {
    return empleados.filter((empleado) => {
      const fechaContratacion = dayjs(empleado.fecha_contratacion);
      const fechaTerminacion = empleado.activo ? dayjs() : dayjs(empleado.fecha_terminacion);

      return fechaContratacion.isBefore(dayjs().month(mes - 1).endOf('month')) && fechaTerminacion.isAfter(dayjs().month(mes - 1).startOf('month'));
    });
  };

  const calcularGastoMensual = (empleado, mes) => {
    const horas = horasTrabajadas[`${empleado.id}-${mes}`] || 160; // 160 horas por defecto
    const costoPorHora = parseFloat(empleado.costo_real) / 160;
    return costoPorHora * horas;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const empleadosFiltrados = filtrarGastoPorMes(selectedMonth);
  const totalGastoNomina = empleadosFiltrados.reduce((total, empleado) => total + calcularGastoMensual(empleado, selectedMonth), 0);
  const totalEmpleadosActivos = empleadosFiltrados.length;

  return (
    <Container>
      <Typography variant="h5" sx={{ color: '#5E55FE', fontWeight: 'bold' }}>Gastos de Nómina</Typography>
      <Select
        value={selectedMonth}
        onChange={handleMonthChange}
        displayEmpty
        sx={{ mt: 2, minWidth: 120 }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <MenuItem key={index + 1} value={index + 1}>
            {dayjs().month(index).format('MMMM')}
          </MenuItem>
        ))}
      </Select>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <KPICard title="Total Gasto en Nómina" value={formatCurrency(totalGastoNomina)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <KPICard title="Total Empleados Activos" value={totalEmpleadosActivos} />
        </Grid>
      </Grid>
      <Button
        onClick={handleOpen}
        sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
        variant="contained"
        startIcon={<AddIcon />}
      >
        Agregar Empleado
      </Button>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {empleadosFiltrados.map((empleado, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} onClick={() => handleOpenDetalle(empleado)}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 1, cursor: 'pointer' }}>
              <Typography variant="h6" sx={{ color: '#5E55FE' }}>{empleado.nombre}</Typography>
              <Typography variant="body1">Salario: {formatCurrency(empleado.salario)}</Typography>
              <Typography variant="body1">Fecha de Contratación: {empleado.fecha_contratacion}</Typography>
              <Typography variant="body1">Rol: {empleado.rol}</Typography>
              <Typography variant="body1">Estado: {empleado.activo ? 'Activo' : `Inactivo (hasta ${empleado.fecha_terminacion})`}</Typography>
              <Typography variant="body1">Costo Real: {formatCurrency(parseFloat(empleado.costo_real))}</Typography>
              <Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>
                Costo De {empleado.nombre} de {dayjs().month(selectedMonth - 1).format('MMMM')}: {formatCurrency(calcularGastoMensual(empleado, selectedMonth))}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Empleado</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
          />
          <TextField
            margin="dense"
            label="Salario"
            type="number"
            fullWidth
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
            sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
          />
          <TextField
            margin="dense"
            label="Fecha de Contratación"
            type="date"
            fullWidth
            value={fechaContratacion}
            onChange={(e) => setFechaContratacion(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
          />
          <TextField
            margin="dense"
            label="Rol"
            type="text"
            fullWidth
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                color="primary"
              />
            }
            label="Activo"
            sx={{ mb: 3 }}
          />
          {!activo && (
            <TextField
              margin="dense"
              label="Fecha de Terminación"
              type="date"
              fullWidth
              value={fechaTerminacion}
              onChange={(e) => setFechaTerminacion(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
          <Button onClick={handleSaveEmpleado} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detalleOpen} onClose={handleCloseDetalle} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del Gasto de {selectedEmpleado?.nombre}</DialogTitle>
        <DialogContent>
          {selectedEmpleado && (
            <>
              <Typography variant="body1">Salario Base: {formatCurrency(selectedEmpleado.salario)}</Typography>
              <Typography variant="body1">Auxilio de Transporte: {formatCurrency(selectedEmpleado.desglose_costo.auxilioTransporte)}</Typography>
              <Typography variant="body1">Prestaciones Sociales: {formatCurrency(selectedEmpleado.desglose_costo.prestacionesSociales)}</Typography>
              <Typography variant="body1">Seguridad Social: {formatCurrency(selectedEmpleado.desglose_costo.seguridadSocial)}</Typography>
              <Typography variant="body1">Parafiscales: {formatCurrency(selectedEmpleado.desglose_costo.parafiscales)}</Typography>
              <Typography variant="h6" sx={{ mt: 2, color: '#5E55FE' }}>Costo Total: {formatCurrency(selectedEmpleado.costo_real)}</Typography>
              <TextField
                margin="dense"
                label="Horas Trabajadas"
                type="number"
                fullWidth
                value={inputHoras}
                onChange={handleHorasChange}
                sx={{ mb: 3, mt: 3,'& .MuiInputBase-root': { borderRadius: '8px' } }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Costo {selectedEmpleado.nombre} de {dayjs().month(selectedMonth - 1).format('MMMM')}: {formatCurrency(calcularGastoMensual(selectedEmpleado, selectedMonth))}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetalle} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
          <Button onClick={handleSaveHoras} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GastosNomina;
