import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Grid, Card, CardContent, Typography, TextField,
  CircularProgress, IconButton, InputAdornment, Button, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import InventoryDialog from './InventoryDialog';
import MovimientosDialog from './MovimientosDialog';
import { useSelector } from 'react-redux';  

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StyledCard = styled(Card)({
  border: '1px solid black',
  borderRadius: '16px',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const StockScreen = () => {
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState({});
  const [editing, setEditing] = useState({});
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimientosDialogOpen, setMovimientosDialogOpen] = useState(false);
  const [newBodegaDialogOpen, setNewBodegaDialogOpen] = useState(false);
  const [newBodegaName, setNewBodegaName] = useState('');
  const token = useSelector((state) => state.auth.token);  // Obtener token de autenticación

  useEffect(() => {
    fetchBodegas();
    fetchProductos();
  }, []);

  const fetchBodegas = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/bodegas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBodegas(response.data);
    } catch (error) {
      console.error('Error al obtener las bodegas', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/productos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos', error);
      setLoading(false);
    }
  };

  const handleBodegaChange = (event) => {
    setBodegaSeleccionada(event.target.value);
    fetchProductos();  // Re-fetch products to reflect the selected warehouse stocks
  };

  const handleStockChange = (id, cantidad) => {
    setStockChanges(prev => ({ ...prev, [id]: cantidad }));
  };

  const handleSaveStock = async (id) => {
    const cantidad = stockChanges[id];
    if (cantidad !== undefined) {
      try {
        const response = await axios.post(`${apiBaseUrl}/productos/${id}/stock`, {
          cantidad,
          bodega_id: bodegaSeleccionada
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEditing(prev => ({ ...prev, [id]: false }));
        setProductos(prevProductos => prevProductos.map(producto =>
          producto.id === id ? { ...producto, stocks: { ...producto.stocks, [bodegaSeleccionada]: response.data.stock } } : producto
        ));
        alert('Stock actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el stock', error);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: true }));
  };

  const handleCancelClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: false }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMovimientosDialogOpen = () => {
    setMovimientosDialogOpen(true);
  };

  const handleMovimientosDialogClose = () => {
    setMovimientosDialogOpen(false);
  };

  const handleNewBodegaDialogOpen = () => {
    setNewBodegaDialogOpen(true);
  };

  const handleNewBodegaDialogClose = () => {
    setNewBodegaDialogOpen(false);
    setNewBodegaName('');
  };

  const handleNewBodegaNameChange = (event) => {
    setNewBodegaName(event.target.value);
  };

  const handleSaveNewBodega = async () => {
    if (newBodegaName.trim() !== '') {
      try {
        const response = await axios.post(`${apiBaseUrl}/bodegas`, { nombre: newBodegaName }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBodegas([...bodegas, response.data]);
        setNewBodegaName('');
        setNewBodegaDialogOpen(false);
      } catch (error) {
        console.error('Error al agregar la nueva bodega', error);
      }
    }
  };

  const handleSaveMovement = async (tipoMovimiento, comentario, cambiosStock, bodegaOrigenId, bodegaDestinoId) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/inventarios/movimiento`, {
        tipo: tipoMovimiento,
        comentario: comentario,
        cambiosStock: cambiosStock,
        bodegaOrigenId: bodegaOrigenId,
        bodegaDestinoId: bodegaDestinoId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert(response.data.mensaje);
      fetchProductos();  // Actualiza la lista de productos después del movimiento
    } catch (error) {
      console.error('Error al registrar los movimientos de inventario', error);
      alert('Error al registrar los movimientos de inventario');
    }
  };

  const calcularStockTotal = (producto) => {
    return bodegas.reduce((total, bodega) => {
      return total + (producto.stocks[bodega.id] || 0);
    }, 0);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" style={{  minHeight: '100vh', paddingTop: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold' }}>
        Gestión de Inventarios
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Buscar producto"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel>Bodega</InputLabel>
        <Select
          value={bodegaSeleccionada}
          onChange={handleBodegaChange}
          label="Bodega"
        >
          {bodegas.map((bodega) => (
            <MenuItem key={bodega.id} value={bodega.id}>
              {bodega.nombre}
            </MenuItem>
          ))}
          <MenuItem value="" onClick={handleNewBodegaDialogOpen}>
            <AddIcon /> Agregar nueva bodega
          </MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleDialogOpen} size="medium" sx={{my: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, mr: 1}}>
        Registrar Movimiento de Inventario
      </Button>
      <Button variant="contained" onClick={handleMovimientosDialogOpen} size="medium" sx={{my: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' },}}>
        Ver Movimientos de Inventario
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredProductos.map(producto => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5">{producto.nombre}</Typography>
                  <Typography variant="body1">Precio: {formatCurrency(producto.precio)}</Typography>
                  <Typography variant="body2">Categoría: {producto.categoria}</Typography>
                  {bodegaSeleccionada ? (
                    <>
                      {editing[producto.id] ? (
                        <>
                          <TextField
                            label="Stock"
                            type="number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={stockChanges[producto.id] !== undefined ? stockChanges[producto.id] : (producto.stocks && producto.stocks[bodegaSeleccionada]) || 0}
                            onChange={(e) => handleStockChange(producto.id, e.target.value)}
                          />
                          <IconButton onClick={() => handleSaveStock(producto.id)} sx={{ color: '#5E55FE'}}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => handleCancelClick(producto.id)} color="secondary">
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="body1">Stock: {producto.stocks && producto.stocks[bodegaSeleccionada] !== undefined ? producto.stocks[bodegaSeleccionada] : 0}</Typography>
                          <IconButton onClick={() => handleEditClick(producto.id)} sx={{ color: '#5E55FE'}}>
                            <EditIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  ) : (
                    <Typography variant="body1">Stock total: {calcularStockTotal(producto)}</Typography>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
      <InventoryDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        productos={productos}
        handleSaveMovement={handleSaveMovement}
        bodegas={bodegas}  // Pasar bodegas como prop
      />
      <MovimientosDialog
        open={movimientosDialogOpen}
        handleClose={handleMovimientosDialogClose}
      />
      <Dialog open={newBodegaDialogOpen} onClose={handleNewBodegaDialogClose}>
        <DialogTitle>Agregar Nueva Bodega</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Bodega"
            fullWidth
            value={newBodegaName}
            onChange={handleNewBodegaNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewBodegaDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveNewBodega} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StockScreen;


