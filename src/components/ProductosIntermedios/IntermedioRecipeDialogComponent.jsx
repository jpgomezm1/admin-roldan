import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Box, Typography, IconButton, Grid, Card, CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const IntermedioRecipeDialogComponent = ({ open, producto, handleCloseDialog, insumos }) => {
  const [receta, setReceta] = useState('');
  const [insumosData, setInsumosData] = useState([]);
  const [unidadesProducidas, setUnidadesProducidas] = useState(1);
  const [isEditable, setIsEditable] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (producto) {
      setReceta(producto.receta || '');
      setUnidadesProducidas(producto.unidades_producidas || 1);
      setIsEditable(false);
      fetchInsumosWithNames(producto.insumos || []);
    }
  }, [producto]);

  const fetchInsumosWithNames = async (insumos) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/productos_proveedor`);
      const allInsumos = response.data;
      const insumosWithNames = insumos.map(insumo => {
        const insumoData = allInsumos.find(item => item.id === insumo.insumoId);
        return {
          ...insumo,
          nombre: insumoData ? insumoData.nombre : 'Desconocido'
        };
      });
      setInsumosData(insumosWithNames);
    } catch (error) {
      console.error('Error fetching insumos names:', error);
    }
  };

  const handleSaveReceta = async () => {
    try {
      const updatedProduct = { ...producto, receta, unidades_producidas: unidadesProducidas };
      await axios.put(`${apiBaseUrl}/productos_intermedios/${producto.id}`, updatedProduct);
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const toggleEditMode = () => {
    setIsEditable(!isEditable);
  };

  const formatUnits = (cantidad, unidad) => {
    return cantidad === 1 && unidad === 'unidades' ? 'unidad' : unidad;
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {producto ? `Receta para ${producto.nombre}` : 'Agregar Receta'}
        <IconButton onClick={toggleEditMode} sx={{ color: '#5E55FE' }}>
          {isEditable ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold' }}>
          {`Receta para ${unidadesProducidas} ${unidadesProducidas === 1 ? 'Unidad' : 'Unidades'}:`}
        </DialogContentText>
        <TextField
          margin="dense"
          label="Unidades Producidas"
          type="number"
          fullWidth
          value={unidadesProducidas}
          onChange={(e) => setUnidadesProducidas(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            readOnly: !isEditable,
          }}
        />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ingredientes:</Typography>
          {insumosData.length > 0 ? (
            <Grid container spacing={2}>
              {insumosData.map((insumo, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ bgcolor: '#f9f9f9', borderRadius: '8px' }}>
                    <CardContent>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{insumo.nombre}</Typography>
                      <Typography variant="body2" color="textSecondary">{insumo.cantidad} {formatUnits(insumo.cantidad, insumo.unidad)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2">No hay insumos asociados.</Typography>
          )}
        </Box>
        <TextField
          margin="dense"
          label="Receta"
          type="text"
          fullWidth
          multiline
          minRows={6}
          value={receta}
          onChange={(e) => setReceta(e.target.value)}
          InputProps={{
            readOnly: !isEditable,
          }}
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: '8px',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDialog} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
        <Button onClick={handleSaveReceta} sx={{ color: '#5E55FE', borderRadius: '8px' }} disabled={!isEditable}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IntermedioRecipeDialogComponent;

