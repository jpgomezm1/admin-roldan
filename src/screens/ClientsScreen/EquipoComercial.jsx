// EquipoComercial.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Card, CardContent, Typography, IconButton, CircularProgress, Avatar, CardHeader } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import PedidosComercial from './PedidosComercial';

const CardStyled = styled(Card)(({ theme }) => ({
  border: '1px solid #ddd',
  borderRadius: '10px',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const EquipoComercial = () => {
  const [comerciales, setComerciales] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedComercial, setSelectedComercial] = useState(null);
  const [newComercial, setNewComercial] = useState({ nombre: '', idComercial: '', ciudad: '', email: '', telefono: '' }); // Agregar email y telefono
  const [loading, setLoading] = useState(false);
  const [pedidosOpen, setPedidosOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchComerciales();
  }, []);

  const fetchComerciales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/comerciales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComerciales(response.data);
    } catch (error) {
      console.error('Error fetching comerciales:', error);
    }
    setLoading(false);
  };

  const handleOpen = (comercial = null) => {
    if (comercial) {
      setSelectedComercial(comercial);
      setNewComercial(comercial);
      setEditMode(true);
    } else {
      setNewComercial({ nombre: '', idComercial: '', ciudad: '', email: '', telefono: '' }); // Reiniciar email y telefono
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedComercial(null);
  };

  const handlePedidosClose = () => {
    setPedidosOpen(false);
    setSelectedComercial(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComercial((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editMode) {
        const response = await axios.put(`${apiBaseUrl}/comercial/${selectedComercial.id}`, newComercial, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComerciales((prevComerciales) =>
          prevComerciales.map((comercial) =>
            comercial.id === selectedComercial.id ? response.data : comercial
          )
        );
      } else {
        const response = await axios.post(`${apiBaseUrl}/comercial`, newComercial, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComerciales((prevComerciales) => [...prevComerciales, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error adding/updating comercial:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/comercial/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComerciales((prevComerciales) => prevComerciales.filter((comercial) => comercial.id !== id));
    } catch (error) {
      console.error('Error deleting comercial:', error);
    }
    setLoading(false);
  };

  const handleCardClick = (comercial) => {
    setSelectedComercial(comercial);
    setPedidosOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
      >
        Agregar Comercial
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? 'Editar Comercial' : 'Agregar Comercial'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre Completo"
            type="text"
            fullWidth
            name="nombre"
            value={newComercial.nombre}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="ID Comercial"
            type="text"
            fullWidth
            name="idComercial"
            value={newComercial.idComercial}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ciudad"
            type="text"
            fullWidth
            name="ciudad"
            value={newComercial.ciudad}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            type="email"
            fullWidth
            name="email"
            value={newComercial.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Número de Teléfono"
            type="tel"
            fullWidth
            name="telefono"
            value={newComercial.telefono}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3} sx={{ mt: 5 }}>
          {comerciales.map((comercial) => (
            <Grid item xs={12} sm={6} md={4} key={comercial.id}>
              <CardStyled onClick={() => handleCardClick(comercial)}>
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: '#5E55FE' }}>{comercial.nombre.charAt(0)}</Avatar>}
                  action={
                    <Box>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleOpen(comercial); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(comercial.id); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  title={comercial.nombre}
                  subheader={`ID: ${comercial.idComercial}`}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Ciudad: {comercial.ciudad}</Typography>
                  <Typography variant="body2" color="textSecondary">Correo: {comercial.email}</Typography>
                  <Typography variant="body2" color="textSecondary">Teléfono: {comercial.telefono}</Typography>
                </CardContent>
              </CardStyled>
            </Grid>
          ))}
        </Grid>
      )}
      {selectedComercial && (
        <PedidosComercial comercial={selectedComercial} open={pedidosOpen} onClose={handlePedidosClose} />
      )}
    </Box>
  );
};

export default EquipoComercial;
