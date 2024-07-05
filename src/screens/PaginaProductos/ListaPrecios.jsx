import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux'; // Importar useSelector
import { styled } from '@mui/system';
import ListaPreciosDialog from './ListaPreciosDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const ListaPrecios = () => {
  const [listas, setListas] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevaLista, setNuevaLista] = useState({ nombre: '', descuento: '' });
  const [editMode, setEditMode] = useState(false);
  const [listaId, setListaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const establecimiento = useSelector((state) => state.auth.establecimiento); // Obtener establecimiento directamente
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchListas();
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

  const handleAddLista = async () => {
    if (!establecimiento) {
      console.error('Establecimiento information is not available');
      return;
    }

    setLoading(true);
    const data = { 
      nombre: nuevaLista.nombre, 
      descuento: nuevaLista.descuento,
      establecimiento: establecimiento // add establecimiento
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
              {listas.map((lista) => (
                <TableRow key={lista.id}>
                  <TableCell>{lista.id}</TableCell>
                  <TableCell>{lista.nombre}</TableCell>
                  <TableCell>{lista.descuento}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(lista)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(lista)}>
                      <DeleteIcon />
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
    </div>
  );
};

export default ListaPrecios;


