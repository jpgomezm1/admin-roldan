import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Box, Typography, IconButton, Grid, Card, CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const RecipeDialogComponent = ({ open, producto, handleCloseDialog }) => {
  const [receta, setReceta] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [unidadesProducidas, setUnidadesProducidas] = useState(1);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (producto) {
      setReceta(producto.receta || '');
      setInsumos(producto.insumos || []);
      setUnidadesProducidas(producto.unidades_producidas || 1);
      setIsEditable(false); // Reset editable state
    }
  }, [producto]);

  const handleSaveReceta = async () => {
    try {
      await axios.put(`${apiBaseUrl}/productos/${producto.id}`, { receta });
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const fetchInsumosNames = async (insumos) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/productos_proveedor`);
      const allInsumos = response.data;
      return insumos.map(insumo => {
        const insumoData = allInsumos.find(item => item.id === insumo.insumo_id);
        return {
          ...insumo,
          nombre: insumoData ? insumoData.nombre : 'Desconocido'
        };
      });
    } catch (error) {
      console.error('Error fetching insumos names:', error);
      return insumos;
    }
  };

  useEffect(() => {
    const loadInsumosWithNames = async () => {
      if (producto && producto.insumos) {
        const insumosWithNames = await fetchInsumosNames(producto.insumos);
        setInsumos(insumosWithNames);
      }
    };

    loadInsumosWithNames();
  }, [producto]);

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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ingredientes:</Typography>
          {insumos.length > 0 ? (
            <Grid container spacing={2}>
              {insumos.map((insumo, index) => (
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

export default RecipeDialogComponent;

