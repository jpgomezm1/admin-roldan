import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Container, CircularProgress, Tabs, Tab, AppBar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import ProductoDialog from '../../components/ProductDialog/ProductDialog';
import ListaPrecios from './ListaPrecios';
import TabPanel from '../GastosScreen/TabPanel';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const PaginaProductos = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precioBase: '',
    iva: 5,
    ipo: '',
    imagen: null,
    categoria: '',
    subcategoria: '',
    descripcion: '',
    costo: '',
  });
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategorias, setSubcategorias] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchProductos();
    fetchSubcategorias();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/productos`);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }
    setLoading(false);
  };

  const fetchSubcategorias = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/subcategorias`);
      setSubcategorias(response.data);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
    }
  };

  const calculatePrecioVenta = () => {
    const { precioBase, iva, ipo } = nuevoProducto;
    if (precioBase && iva && ipo) {
      const base = parseFloat(precioBase);
      const ivaAmount = base * (iva / 100);
      const ipoAmount = parseFloat(ipo);
      return base + ivaAmount + ipoAmount;
    }
    return 0;
  };

  const handleAddProducto = async () => {
    setLoading(true);

    const productoData = {
      nombre: nuevoProducto.nombre,
      precio_base: nuevoProducto.precioBase,
      precio: calculatePrecioVenta(),
      categoria: nuevoProducto.categoria,
      subcategoria: nuevoProducto.subcategoria,
      descripcion: nuevoProducto.descripcion || '',
      ipo: nuevoProducto.ipo,
      costo: nuevoProducto.costo,
    };

    if (editMode) {
      try {
        const response = await axios.put(
          `${apiBaseUrl}/productos/${productoId}`,
          productoData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setProductos(
          productos.map((p) => (p.id === productoId ? response.data : p))
        );
        handleClose();
      } catch (error) {
        console.error('Error al editar el producto', error.response);
      }
    } else {
      const formData = new FormData();
      formData.append('nombre', nuevoProducto.nombre);
      formData.append('precio_base', nuevoProducto.precioBase);
      formData.append('precio', calculatePrecioVenta());
      formData.append('categoria', nuevoProducto.categoria);
      formData.append('subcategoria', nuevoProducto.subcategoria);
      formData.append('descripcion', nuevoProducto.descripcion || '');
      formData.append('ipo', nuevoProducto.ipo);
      formData.append('costo', nuevoProducto.costo);
      if (nuevoProducto.imagen) {
        formData.append('imagen', nuevoProducto.file);
      }

      try {
        const response = await axios.post(`${apiBaseUrl}/productos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProductos([...productos, response.data]);
        handleClose();
      } catch (error) {
        console.error('Error al agregar el producto', error.response);
      }
    }

    setLoading(false);
  };

  const handleEdit = (producto) => {
    setNuevoProducto({
      ...producto,
      precioBase: producto.precio_base,
      iva: 5,
      ipo: producto.ipo,
      costo: producto.costo,
    });
    setProductoId(producto.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (producto) => {
    setProductoAEliminar(producto);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/productos/${productoAEliminar.id}`);
      setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
      setConfirmOpen(false);
    } catch (error) {
      console.error('Error al eliminar el producto', error);
    }
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setNuevoProducto({
      nombre: '',
      precioBase: '',
      iva: 5,
      ipo: '',
      imagen: null,
      categoria: '',
      subcategoria: '',
      descripcion: '',
      costo: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNuevoProducto((prev) => ({ ...prev, imagen: imageUrl, file }));
    } else {
      setNuevoProducto((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCategoriaChange = (event) => {
    setCategoriaFiltro(event.target.value);
  };

  const handleSubcategoriaChange = (event) => {
    setSubcategoriaFiltro(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const categorias = [...new Set(productos.map((producto) => producto.categoria))];

  const subcategoriasDisponibles = subcategorias.filter(
    (subcategoria) =>
      !categoriaFiltro || subcategoria.categoria_id === categoriaFiltro
  );

  const filteredProductos = productos.filter(
    (producto) =>
      (categoriaFiltro === '' || producto.categoria === categoriaFiltro) &&
      (subcategoriaFiltro === '' || producto.subcategoria === subcategoriaFiltro) &&
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Precio Base</StyledTableCell>
            <StyledTableCell>IVA</StyledTableCell>
            <StyledTableCell>IPO</StyledTableCell>
            <StyledTableCell>Precio Venta</StyledTableCell>
            <StyledTableCell>Costo</StyledTableCell>
            <StyledTableCell>Categoría</StyledTableCell>
            <StyledTableCell>Subcategoría</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProductos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{formatCurrency(producto.precio_base)}</TableCell>
              <TableCell>5%</TableCell>
              <TableCell>{formatCurrency(producto.ipo)}</TableCell>
              <TableCell>{formatCurrency(producto.precio)}</TableCell>
              <TableCell>{formatCurrency(producto.costo)}</TableCell>
              <TableCell>{producto.categoria}</TableCell>
              <TableCell>{producto.subcategoria}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(producto)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(producto)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="xl">
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
            aria-label="product tabs"
            TabIndicatorProps={{ style: { backgroundColor: '#5E55FE', height: '4px' } }}
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
            <Tab label="Productos" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Listas de Precios" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleClickOpen}
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              backgroundColor: '#5E55FE',
              color: 'white',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#7b45a1' },
            }}
          >
            Agregar Producto
          </Button>
          <Grid container spacing={3} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Buscar Producto"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={categoriaFiltro}
                  onChange={handleCategoriaChange}
                  label="Categoría"
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  {categorias.map((categoria, index) => (
                    <MenuItem key={index} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Subcategoría</InputLabel>
                <Select
                  value={subcategoriaFiltro}
                  onChange={handleSubcategoriaChange}
                  label="Subcategoría"
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  {subcategoriasDisponibles.map((subcategoria) => (
                    <MenuItem key={subcategoria.id} value={subcategoria.nombre}>
                      {subcategoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {loading ? (
            <CircularProgress />
          ) : (
            renderTable()
          )}
          <ProductoDialog
            open={open}
            handleClose={handleClose}
            handleChange={handleChange}
            handleAddProducto={handleAddProducto}
            nuevoProducto={nuevoProducto}
            loading={loading}
            editMode={editMode}
            subcategorias={subcategorias}
          />
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              ¿Estás seguro de que deseas eliminar el producto{' '}
              {productoAEliminar && productoAEliminar.nombre}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#5E55FE' }}>
                Cancelar
              </Button>
              <Button onClick={confirmDelete} sx={{ color: 'red' }}>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ListaPrecios />
        </TabPanel>
      </Container>
    </div>
  );
};

export default PaginaProductos;
