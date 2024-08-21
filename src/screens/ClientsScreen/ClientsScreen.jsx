import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  AppBar,
  CircularProgress,
  Switch,
  TablePagination,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import EquipoComercial from './EquipoComercial';
import TabPanel from '../GastosScreen/TabPanel';
import PedidosClienteDialog from './PedidosClienteDialog';
import CargaMasivaClientes from './CargaMasivaClientes';
import ClientTable from './ClientTable';  // Importa el nuevo componente

const ClientsScreen = () => {
  const [clients, setClients] = useState([]);
  const [estadisticasClientes, setEstadisticasClientes] = useState({});
  const [open, setOpen] = useState(false);
  const [openPedidosDialog, setOpenPedidosDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClient, setNewClient] = useState({
    nombre: '',
    razon_social: '',
    telefono: '',
    correo: '',
    nit: '',
    rut: null,
    diasCartera: '',
    listaPreciosId: '',
    direccion: '',
    ciudad: '',
    tipo: 'Persona Natural',
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [listasPrecios, setListasPrecios] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState('ticket_promedio');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalClients, setTotalClients] = useState(0);

  const token = useSelector((state) => state.auth.token);
  const establecimiento = useSelector((state) => state.auth.establecimiento);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes`, {
          params: {
            page: page + 1,
            per_page: rowsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data.clientes);
        setTotalClients(response.data.total);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
      setLoading(false);
    };

    const fetchListasPrecios = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/listasprecios`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setListasPrecios(response.data);
      } catch (error) {
        console.error('Error fetching listas de precios:', error);
      }
    };

    const fetchEstadisticasClientes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes/estadisticas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const estadisticas = response.data.reduce((acc, curr) => {
          acc[curr.cliente_id] = {
            total_gastado: curr.total_gastado_con_descuento || curr.total_gastado,
            ticket_promedio: curr.ticket_promedio_con_descuento || curr.ticket_promedio,
          };
          return acc;
        }, {});
        setEstadisticasClientes(estadisticas);
      } catch (error) {
        console.error('Error fetching client statistics:', error);
      }
    };

    fetchClients();
    fetchListasPrecios();
    fetchEstadisticasClientes();
  }, [token, page, rowsPerPage]);

  const handleOpen = (client = null) => {
    if (client) {
      setSelectedClient(client);
      setNewClient({
        nombre: client.nombre,
        razon_social: client.razon_social,
        telefono: client.telefono,
        correo: client.correo,
        nit: client.nit,
        rut: client.rut,
        diasCartera: client.diasCartera,
        listaPreciosId: client.listaPreciosId,
        direccion: client.direccion,
        ciudad: client.ciudad,
        tipo: client.tipo,
      });
      setEditMode(true);
    } else {
      setNewClient({
        nombre: '',
        razon_social: '',
        telefono: '',
        correo: '',
        nit: '',
        rut: null,
        diasCartera: '',
        listaPreciosId: '',
        direccion: '',
        ciudad: '',
        tipo: 'Persona Natural',
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
    setFileUploaded(false);
  };

  const handlePedidosDialogOpen = (client) => {
    setSelectedClient(client);
    setOpenPedidosDialog(true);
  };

  const handlePedidosDialogClose = () => {
    setOpenPedidosDialog(false);
    setSelectedClient(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewClient((prev) => ({ ...prev, rut: e.target.files[0] }));
    setFileUploaded(true);
  };

  const handleSubmit = async () => {
    if (!establecimiento) {
      console.error('Información del establecimiento no disponible');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', newClient.nombre);
    formData.append('razon_social', newClient.razon_social);
    formData.append('telefono', newClient.telefono);
    formData.append('correo', newClient.correo);
    formData.append('nit', newClient.nit);
    formData.append('diasCartera', newClient.diasCartera);
    formData.append('listaPreciosId', newClient.listaPreciosId);
    formData.append('establecimiento', establecimiento);
    formData.append('direccion', newClient.direccion);
    formData.append('ciudad', newClient.ciudad);
    formData.append('tipo', newClient.tipo);
    if (newClient.rut) {
      formData.append('rut', newClient.rut);
    }

    try {
      if (editMode) {
        if (!selectedClient) {
          console.error('No client selected for editing');
          return;
        }

        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/cliente/${selectedClient.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === selectedClient.id
              ? { ...newClient, id: selectedClient.id, rut: response.data.rut }
              : client
          )
        );
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/cliente`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setClients((prevClients) => [
          ...prevClients,
          { ...newClient, id: response.data.id, rut: response.data.rut },
        ]);
      }
      setOpen(false);
      setNewClient({
        nombre: '',
        razon_social: '',
        telefono: '',
        correo: '',
        nit: '',
        rut: null,
        diasCartera: '',
        listaPreciosId: '',
        direccion: '',
        ciudad: '',
        tipo: 'Persona Natural',
      });
      setFileUploaded(false);
    } catch (error) {
      console.error('Error adding/updating client:', error);
    }
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSortColumnChange = (event) => {
    setSortColumn(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  const sortedClients = clients.slice().sort((a, b) => {
    const aStat = estadisticasClientes[a.id]
      ? estadisticasClientes[a.id][sortColumn]
      : 0;
    const bStat = estadisticasClientes[b.id]
      ? estadisticasClientes[b.id][sortColumn]
      : 0;

    if (sortOrder === 'asc') {
      return aStat - bStat;
    } else {
      return bStat - aStat;
    }
  });

  return (
    <Box sx={{ p: 4 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '2px solid #5E55FE',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="client tabs"
          TabIndicatorProps={{
            style: { backgroundColor: '#5E55FE', height: '4px' },
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#5E55FE',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: '#ffffff',
                backgroundColor: '#5E55FE',
              },
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: '1px solid #5E55FE',
            },
          }}
        >
          <Tab label="Clientes" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Equipo Comercial" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            mt: 2,
            backgroundColor: '#5E55FE',
            color: 'white',
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#7b45a1' },
          }}
        >
          Agregar Cliente
        </Button>

        {/* Controles de ordenación */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <FormControl sx={{ mr: 2 }}>
            <InputLabel id="sort-column-label">Ordenar por</InputLabel>
            <Select
              labelId="sort-column-label"
              value={sortColumn}
              onChange={handleSortColumnChange}
              label="Ordenar por"
            >
              <MenuItem value="ticket_promedio">Ticket Promedio</MenuItem>
              <MenuItem value="total_gastado">Total Gastado</MenuItem>
            </Select>
          </FormControl>
          <Typography>Ascendente</Typography>
          <Switch checked={sortOrder === 'desc'} onChange={handleSortOrderChange} />
          <Typography>Descendente</Typography>
        </Box>

        {/* Componente para carga masiva de clientes */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Carga Masiva de Clientes</Typography>
          <CargaMasivaClientes />
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editMode ? 'Editar Cliente' : 'Agregar Cliente'}
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
              label="Nombre Comercial"
              type="text"
              fullWidth
              name="nombre"
              value={newClient.nombre}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Razón Social"
              type="text"
              fullWidth
              name="razon_social"
              value={newClient.razon_social}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Teléfono"
              type="text"
              fullWidth
              name="telefono"
              value={newClient.telefono}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Correo"
              type="email"
              fullWidth
              name="correo"
              value={newClient.correo}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="NIT (opcional)"
              type="text"
              fullWidth
              name="nit"
              value={newClient.nit}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Días de Cartera"
              type="number"
              fullWidth
              name="diasCartera"
              value={newClient.diasCartera}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Dirección"
              type="text"
              fullWidth
              name="direccion"
              value={newClient.direccion}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Ciudad"
              type="text"
              fullWidth
              name="ciudad"
              value={newClient.ciudad}
              onChange={handleChange}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="lista-precios-label">Lista de Precios</InputLabel>
              <Select
                labelId="lista-precios-label"
                name="listaPreciosId"
                value={newClient.listaPreciosId}
                onChange={handleChange}
                label="Lista de Precios"
              >
                <MenuItem value="">
                  <em>Ninguna</em>
                </MenuItem>
                {listasPrecios.map((lista) => (
                  <MenuItem key={lista.id} value={lista.id}>
                    {lista.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="tipo-label">Tipo Cliente</InputLabel>
              <Select
                labelId="tipo-label"
                name="tipo"
                value={newClient.tipo}
                onChange={handleChange}
                label="Tipo"
              >
                <MenuItem value="Persona Natural">Persona Natural</MenuItem>
                <MenuItem value="Empresa">Empresa</MenuItem>
                <MenuItem value="Distribuidor">Distribuidor</MenuItem>
              </Select>
            </FormControl>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="rut-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="rut-upload">
              <Button
                variant="contained"
                component="span"
                sx={{
                  mt: 2,
                  backgroundColor: '#5E55FE',
                  color: 'white',
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#7b45a1' },
                }}
              >
                Subir RUT
              </Button>
            </label>
            {fileUploaded && (
              <Typography variant="body2" color="success.main">
                Archivo cargado exitosamente
              </Typography>
            )}
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
          <ClientTable
            clients={sortedClients}
            listasPrecios={listasPrecios}
            estadisticasClientes={estadisticasClientes}
            handlePedidosDialogOpen={handlePedidosDialogOpen}
            handleOpen={handleOpen}
            handleDownload={handleDownload}
          />
        )}
        <TablePagination
          component="div"
          count={totalClients}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EquipoComercial />
      </TabPanel>
      {selectedClient && (
        <PedidosClienteDialog
          cliente={selectedClient}
          open={openPedidosDialog}
          onClose={handlePedidosDialogClose}
        />
      )}
    </Box>
  );
};

export default ClientsScreen;
