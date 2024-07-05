import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Color del logo de tu empresa
const primaryColor = '#4A90E2';  // Cambia este valor al color exacto de tu logo

// Reutilizamos el StyledTableCell de Modals.jsx
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
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: primaryColor,
  }
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const BarrioTable = () => {
  const [barrios, setBarrios] = useState({});
  const [newBarrio, setNewBarrio] = useState('');
  const [newCosto, setNewCosto] = useState('');
  const [editBarrio, setEditBarrio] = useState(null);
  const [editCosto, setEditCosto] = useState('');
  const [barriosIds, setBarriosIds] = useState({});

  useEffect(() => {
    // Fetch initial barrios data from the API
    const fetchBarrios = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/barrios');  // Cambia esta URL a la correcta
        const fetchedBarrios = response.data.reduce((acc, barrio) => {
          acc[barrio.nombre] = barrio.costo;
          setBarriosIds((prevIds) => ({ ...prevIds, [barrio.nombre]: barrio.id }));
          return acc;
        }, {});
        setBarrios(fetchedBarrios);
      } catch (error) {
        console.error('Error fetching barrios:', error);
      }
    };

    fetchBarrios();
  }, []);

  const handleAddBarrio = async () => {
    if (newBarrio && newCosto) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/barrios', { nombre: newBarrio, costo: parseInt(newCosto) });
        const addedBarrio = response.data;
        setBarrios({ ...barrios, [addedBarrio.nombre]: addedBarrio.costo });
        setBarriosIds((prevIds) => ({ ...prevIds, [addedBarrio.nombre]: addedBarrio.id }));
        setNewBarrio('');
        setNewCosto('');
      } catch (error) {
        console.error('Error adding barrio:', error);
      }
    }
  };

  const handleEdit = (barrio, costo) => {
    setEditBarrio(barrio);
    setEditCosto(costo);
  };

  const handleSave = async (oldBarrio) => {
    try {
      const barrioId = barriosIds[oldBarrio];
      const response = await axios.put(`http://127.0.0.1:5000/barrios/${barrioId}`, { nombre: editBarrio, costo: parseInt(editCosto) });
      const updatedBarrio = response.data;
      const updatedBarrios = { ...barrios };
      delete updatedBarrios[oldBarrio];
      setBarrios({ ...updatedBarrios, [updatedBarrio.nombre]: updatedBarrio.costo });
      setBarriosIds((prevIds) => ({ ...prevIds, [updatedBarrio.nombre]: updatedBarrio.id }));
      setEditBarrio(null);
      setEditCosto('');
    } catch (error) {
      console.error('Error updating barrio:', error);
    }
  };

  const handleDeleteBarrio = async (barrio) => {
    try {
      const barrioId = barriosIds[barrio];
      await axios.delete(`http://127.0.0.1:5000/barrios/${barrioId}`);
      const { [barrio]: _, ...newBarrios } = barrios;
      setBarrios(newBarrios);
      const { [barrio]: __, ...newIds } = barriosIds;
      setBarriosIds(newIds);
    } catch (error) {
      console.error('Error deleting barrio:', error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1>Configurar Barrios y Costos de Domicilio</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Barrio</StyledTableCell>
              <StyledTableCell align="right">Costo</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(barrios).map((barrio) => (
              <TableRow key={barrio}>
                {editBarrio === barrio ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editBarrio}
                        onChange={(e) => setEditBarrio(e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        value={editCosto}
                        onChange={(e) => setEditCosto(e.target.value)}
                        type="number"
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleSave(barrio)}>
                        <SaveIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell component="th" scope="row">
                      {barrio}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(barrios[barrio])}</TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleEdit(barrio, barrios[barrio])}>
                        <EditIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handleDeleteBarrio(barrio)}>
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
                  label="Nuevo Barrio"
                  value={newBarrio}
                  onChange={(e) => setNewBarrio(e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  label="Costo"
                  value={newCosto}
                  onChange={(e) => setNewCosto(e.target.value)}
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell align="right">
                <StyledButton variant="contained" onClick={handleAddBarrio}>
                  Agregar Barrio
                </StyledButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BarrioTable;

