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

const SubcategoriaTable = () => {
  const [subcategorias, setSubcategorias] = useState({});
  const [newSubcategoria, setNewSubcategoria] = useState('');
  const [editSubcategoria, setEditSubcategoria] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [subcategoriasIds, setSubcategoriasIds] = useState({});

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/subcategorias`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const fetchedSubcategorias = response.data.reduce((acc, subcategoria) => {
          acc[subcategoria.nombre] = subcategoria.id;
          setSubcategoriasIds((prevIds) => ({ ...prevIds, [subcategoria.nombre]: subcategoria.id }));
          return acc;
        }, {});
        setSubcategorias(fetchedSubcategorias);
      } catch (error) {
        console.error('Error fetching subcategorias:', error);
      }
    };

    fetchSubcategorias();
  }, [apiBaseUrl]);

  const handleAddSubcategoria = async () => {
    if (newSubcategoria) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${apiBaseUrl}/subcategorias`, { nombre: newSubcategoria }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const addedSubcategoria = response.data;
        setSubcategorias({ ...subcategorias, [addedSubcategoria.nombre]: addedSubcategoria.id });
        setSubcategoriasIds((prevIds) => ({ ...prevIds, [addedSubcategoria.nombre]: addedSubcategoria.id }));
        setNewSubcategoria('');
      } catch (error) {
        console.error('Error adding subcategoria:', error);
      }
    }
  };

  const handleEdit = (nombre) => {
    setEditSubcategoria(nombre);
    setEditNombre(nombre);
  };

  const handleSave = async (oldNombre) => {
    try {
      const token = localStorage.getItem('token');
      const subcategoriaId = subcategoriasIds[oldNombre];
      const response = await axios.put(`${apiBaseUrl}/subcategorias/${subcategoriaId}`, { nombre: editNombre }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedSubcategoria = response.data;
      const updatedSubcategorias = { ...subcategorias };
      delete updatedSubcategorias[oldNombre];
      setSubcategorias({ ...updatedSubcategorias, [updatedSubcategoria.nombre]: updatedSubcategoria.id });
      setSubcategoriasIds((prevIds) => ({ ...prevIds, [updatedSubcategoria.nombre]: updatedSubcategoria.id }));
      setEditSubcategoria(null);
      setEditNombre('');
    } catch (error) {
      console.error('Error updating subcategoria:', error);
    }
  };

  const handleDeleteSubcategoria = async (nombre) => {
    try {
      const token = localStorage.getItem('token');
      const subcategoriaId = subcategoriasIds[nombre];
      await axios.delete(`${apiBaseUrl}/subcategorias/${subcategoriaId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { [nombre]: _, ...newSubcategorias } = subcategorias;
      setSubcategorias(newSubcategorias);
      const { [nombre]: __, ...newIds } = subcategoriasIds;
      setSubcategoriasIds(newIds);
    } catch (error) {
      console.error('Error deleting subcategoria:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Subcategoría</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(subcategorias).map((nombre) => (
              <TableRow key={nombre}>
                {editSubcategoria === nombre ? (
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
                      <StyledIconButton onClick={() => handleDeleteSubcategoria(nombre)}>
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
                  label="Nueva Subcategoría"
                  value={newSubcategoria}
                  onChange={(e) => setNewSubcategoria(e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <StyledButton variant="contained" onClick={handleAddSubcategoria}>
                  Agregar Subcategoría
                </StyledButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubcategoriaTable;
