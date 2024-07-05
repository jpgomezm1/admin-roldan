import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

const AddGastoDialog = ({ open, handleClose, handleSaveGasto, gasto }) => {
  const [tipoGasto, setTipoGasto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [soporte, setSoporte] = useState(null);
  const [status, setStatus] = useState('Pago Pendiente por aprobacion');

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (gasto) {
      setTipoGasto(gasto.tipo_gasto);
      setDescripcion(gasto.descripcion);
      setMonto(gasto.monto);
      setFecha(gasto.fecha);
      setStatus(gasto.status);
      setSoporte(null);  // Resetea el archivo cargado
    } else {
      setTipoGasto('');
      setDescripcion('');
      setMonto('');
      setFecha('');
      setStatus('Pago Pendiente por aprobacion');
      setSoporte(null);
    }
  }, [gasto]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('tipo_gasto', tipoGasto);
    formData.append('descripcion', descripcion);
    formData.append('monto', monto);
    formData.append('fecha', fecha);
    formData.append('status', status);
    if (soporte) {
      formData.append('soporte', soporte);
    }

    try {
      let response;
      if (gasto) {
        response = await axios.put(`${apiBaseUrl}/gastos/${gasto.id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(`${apiBaseUrl}/gastos`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      handleSaveGasto(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
    }
  };

  const handleFileChange = (e) => {
    setSoporte(e.target.files[0]);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{gasto ? 'Editar Gasto' : 'Agregar Gasto'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tipo de Gasto"
          type="text"
          fullWidth
          value={tipoGasto}
          onChange={(e) => setTipoGasto(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Monto"
          type="number"
          fullWidth
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Fecha del Gasto"
          type="date"
          fullWidth
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <label htmlFor="contained-button-file">
            <Input 
              accept="application/pdf, image/*" 
              id="contained-button-file" 
              type="file" 
              onChange={handleFileChange} 
              disabled={status !== 'Pago Aprobado'}
            />
            <Button 
              variant="contained" 
              component="span" 
              sx={{ mr: 2, backgroundColor: '#5E55FE', color: 'white', '&:hover': { backgroundColor: '#7b45a1' } }}
              disabled={status !== 'Pago Aprobado'}
            >
              Subir Soporte
            </Button>
          </label>
          {soporte && <Typography variant="body2">{soporte.name}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
        <Button onClick={handleSave} sx={{ color: '#5E55FE', borderRadius: '8px' }}>{gasto ? 'Guardar Cambios' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGastoDialog;
