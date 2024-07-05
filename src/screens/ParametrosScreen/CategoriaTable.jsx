import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const primaryColor = '#4A90E2';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: primaryColor,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  textTransform: 'none',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: primaryColor,
  }
}));

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState({});
  const [newCategoria, setNewCategoria] = useState('');
  const [editCategoria, setEditCategoria] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [categoriasIds, setCategoriasIds] = useState({});

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de que el token JWT esté almacenado en localStorage
        const response = await axios.get(`${apiBaseUrl}/categorias`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const fetchedCategorias = response.data.reduce((acc, categoria) => {
          acc[categoria.nombre] = categoria.id;
          setCategoriasIds((prevIds) => ({ ...prevIds, [categoria.nombre]: categoria.id }));
          return acc;
        }, {});
        setCategorias(fetchedCategorias);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, [apiBaseUrl]);

  const handleAddCategoria = async () => {
    if (newCategoria) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${apiBaseUrl}/categorias`, { nombre: newCategoria }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const addedCategoria = response.data;
        setCategorias({ ...categorias, [addedCategoria.nombre]: addedCategoria.id });
        setCategoriasIds((prevIds) => ({ ...prevIds, [addedCategoria.nombre]: addedCategoria.id }));
        setNewCategoria('');
      } catch (error) {
        console.error('Error adding categoria:', error);
      }
    }
  };

  const handleEdit = (nombre) => {
    setEditCategoria(nombre);
    setEditNombre(nombre);
  };

  const handleSave = async (oldNombre) => {
    try {
      const token = localStorage.getItem('token');
      const categoriaId = categoriasIds[oldNombre];
      const response = await axios.put(`${apiBaseUrl}/categorias/${categoriaId}`, { nombre: editNombre }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedCategoria = response.data;
      const updatedCategorias = { ...categorias };
      delete updatedCategorias[oldNombre];
      setCategorias({ ...updatedCategorias, [updatedCategoria.nombre]: updatedCategoria.id });
      setCategoriasIds((prevIds) => ({ ...prevIds, [updatedCategoria.nombre]: updatedCategoria.id }));
      setEditCategoria(null);
      setEditNombre('');
    } catch (error) {
      console.error('Error updating categoria:', error);
    }
  };

  const handleDeleteCategoria = async (nombre) => {
    try {
      const token = localStorage.getItem('token');
      const categoriaId = categoriasIds[nombre];
      await axios.delete(`${apiBaseUrl}/categorias/${categoriaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { [nombre]: _, ...newCategorias } = categorias;
      setCategorias(newCategorias);
      const { [nombre]: __, ...newIds } = categoriasIds;
      setCategoriasIds(newIds);
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1>Configurar Categorías del Menú</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Categoría</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(categorias).map((nombre) => (
              <TableRow key={nombre}>
                {editCategoria === nombre ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleSave(nombre)}>
                        <SaveIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell component="th" scope="row">
                      {nombre}
                    </TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleEdit(nombre)}>
                        <EditIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handleDeleteCategoria(nombre)}>
                        <DeleteIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <TextField
                  label="Nueva Categoría"
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <StyledButton variant="contained" onClick={handleAddCategoria}>
                  Agregar Categoría
                </StyledButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoriaTable;
