import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import ListaPreciosDialog from './ListaPreciosDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const WideDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    minWidth: '800px',
  },
}));

const ListaPrecios = () => {
  const [listas, setListas] = useState([]);
  const [open, setOpen] = useState(false);
  const [productosDialogOpen, setProductosDialogOpen] = useState(false);
  const [selectedLista, setSelectedLista] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaLista, setNuevaLista] = useState({ nombre: '', descuento: '' });
  const [editMode, setEditMode] = useState(false);
  const [listaId, setListaId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const establecimiento = useSelector((state) => state.auth.establecimiento);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchListas();
    fetchProductos();
  }, []);

  const fetchListas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/listasprecios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListas(response.data);
    } catch (error) {
      console.error('Error al obtener las listas de precios', error);
    }
    setLoading(false);
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/productos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }
    setLoading(false);
  };

  const handleAddLista = async () => {
    if (!establecimiento) {
      console.error('Establecimiento information is not available');
      return;
    }

    setLoading(true);
    const data = { 
      nombre: nuevaLista.nombre, 
      descuento: nuevaLista.descuento,
      establecimiento: establecimiento
    };

    try {
      if (editMode) {
        const response = await axios.put(`${apiBaseUrl}/listasprecios/${listaId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListas(listas.map(l => (l.id === listaId ? response.data : l)));
      } else {
        const response = await axios.post(`${apiBaseUrl}/listasprecios`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListas([...listas, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error al agregar o editar la lista de precios', error.response);
    }
    setLoading(false);
  };

  const handleEdit = lista => {
    setNuevaLista({ nombre: lista.nombre, descuento: lista.descuento });
    setListaId(lista.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async lista => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/listasprecios/${lista.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListas(listas.filter(l => l.id !== lista.id));
    } catch (error) {
      console.error('Error al eliminar la lista de precios', error);
    }
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setNuevaLista({ nombre: '', descuento: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaLista(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenProductosDialog = lista => {
    setSelectedLista(lista);
    setProductosDialogOpen(true);
  };

  const handleCloseProductosDialog = () => {
    setProductosDialogOpen(false);
    setSelectedLista(null);
  };

  const calculateDiscountedPrice = (precioBase, descuento) => {
    return precioBase - (precioBase * (descuento / 100));
  };

  const calculateIva = (precio) => {
    const IVA_RATE = 5; // 5%
    return precio * (IVA_RATE / 100);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen} variant="contained" size="large" sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}>
        Agregar Lista de Precios
      </Button>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mt: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Descuento (%)</StyledTableCell>
                <StyledTableCell>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listas.map((lista, index) => (
                <TableRow key={lista.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lista.nombre}</TableCell>
                  <TableCell>{lista.descuento}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(lista)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(lista)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenProductosDialog(lista)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ListaPreciosDialog
        open={open}
        handleClose={handleClose}
        handleChange={handleChange}
        handleAddLista={handleAddLista}
        nuevaLista={nuevaLista}
        editMode={editMode}
      />
      <WideDialog open={productosDialogOpen} onClose={handleCloseProductosDialog}>
        <DialogTitle>Productos de la Lista: {selectedLista && selectedLista.nombre}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Producto</StyledTableCell>
                <StyledTableCell>Precio Base</StyledTableCell>
                <StyledTableCell>% Descuento</StyledTableCell>
                <StyledTableCell>Precio con Descuento</StyledTableCell>
                <StyledTableCell>IVA</StyledTableCell>
                <StyledTableCell>IPO</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedLista && productos.map((producto) => {
                const precioDescuento = calculateDiscountedPrice(producto.precio_base, selectedLista.descuento);
                const iva = calculateIva(precioDescuento);
                const ipo = parseFloat(producto.ipo);
                return (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{formatCurrency(producto.precio_base)}</TableCell>
                    <TableCell>{selectedLista.descuento}%</TableCell>
                    <TableCell>{formatCurrency(precioDescuento)}</TableCell>
                    <TableCell>{formatCurrency(iva)}</TableCell>
                    <TableCell>{formatCurrency(ipo)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductosDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </WideDialog>
    </div>
  );
};

export default ListaPrecios;

