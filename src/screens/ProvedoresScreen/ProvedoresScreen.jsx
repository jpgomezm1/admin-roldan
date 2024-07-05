import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Grid, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Box, Select, MenuItem, TextField, FormControl, InputLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductoDialog from './ProductoDialog';
import ProveedorDialog from './ProveedorDialog';
import ProveedorCard from './ProveedorCard';
import ProductoCard from './ProductoCard';
import ProveedorProductosDialog from './ProveedorProductosDialog';
import CategoriaDialog from './CategoriaDialog';
import CategoriasDialog from './CategoriasDialog';
import PedidoDialog from './PedidoDialog';
import PedidosList from './PedidosList'; // Importar el nuevo componente

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

function ProveedoresScreen() {
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categoriasProductos, setCategoriasProductos] = useState([]);
  const [categoriasProveedores, setCategoriasProveedores] = useState([]);
  const [openProductoDialog, setOpenProductoDialog] = useState(false);
  const [openProveedorDialog, setOpenProveedorDialog] = useState(false);
  const [openCategoriaDialog, setOpenCategoriaDialog] = useState(false);
  const [openCategoriasDialog, setOpenCategoriasDialog] = useState(false);
  const [openProveedorProductosDialog, setOpenProveedorProductosDialog] = useState(false);
  const [openPedidoDialog, setOpenPedidoDialog] = useState(false);
  const [selectedProveedorProductos, setSelectedProveedorProductos] = useState([]);
  const [view, setView] = useState('productos');
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductosProveedor();
    fetchProveedores();
    fetchCategorias();
  }, []);

  const fetchProductosProveedor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/productos_proveedor`);
      setProductosProveedor(response.data);
    } catch (error) {
      console.error('Error al obtener los productos del proveedor', error);
    }
    setLoading(false);
  };

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/proveedores`);
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener los proveedores', error);
    }
    setLoading(false);
  };

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/categorias_suppliers`);
      const categorias = response.data;
      setCategoriasProductos(categorias.filter(c => c.tipo === 'producto'));
      setCategoriasProveedores(categorias.filter(c => c.tipo === 'proveedor'));
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
    setLoading(false);
  };

  const handleAddOrEditProductoProveedor = async (producto) => {
    setLoading(true);
    try {
      if (editingProduct) {
        await axios.put(`${apiBaseUrl}/productos_proveedor/${editingProduct.id}`, producto);
      } else {
        const response = await axios.post(`${apiBaseUrl}/productos_proveedor`, producto);
        setProductosProveedor([...productosProveedor, response.data]);
      }
      setOpenProductoDialog(false);
      setEditingProduct(null);
      fetchProductosProveedor();
    } catch (error) {
      console.error('Error al agregar o editar producto del proveedor', error);
    }
    setLoading(false);
  };

  const handleAddOrEditProveedor = async (proveedor) => {
    setLoading(true);
    try {
      if (editingSupplier) {
        await axios.put(`${apiBaseUrl}/proveedores/${editingSupplier.id}`, proveedor);
      } else {
        const response = await axios.post(`${apiBaseUrl}/proveedores`, proveedor);
        setProveedores([...proveedores, response.data]);
      }
      setOpenProveedorDialog(false);
      setEditingSupplier(null);
      fetchProveedores();
    } catch (error) {
      console.error('Error al agregar o editar proveedor', error);
    }
    setLoading(false);
  };

  const handleAddCategoria = async (categoria) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseUrl}/categorias_suppliers`, categoria);
      setOpenCategoriaDialog(false);
      fetchCategorias();
    } catch (error) {
      console.error('Error al agregar categoría', error);
    }
    setLoading(false);
  };

  const handleEditCategoria = async (categoria) => {
    setLoading(true);
    try {
      await axios.put(`${apiBaseUrl}/categorias_suppliers/${categoria.id}`, categoria);
      fetchCategorias();
    } catch (error) {
      console.error('Error al editar categoría', error);
    }
    setLoading(false);
  };

  const handleDeleteCategoria = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/categorias_suppliers/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría', error);
    }
    setLoading(false);
  };

  const handleEditProducto = (producto) => {
    setEditingProduct(producto);
    setOpenProductoDialog(true);
  };

  const handleEditProveedor = (proveedor) => {
    setEditingSupplier(proveedor);
    setOpenProveedorDialog(true);
  };

  const handleDeleteProducto = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/productos_proveedor/${id}`);
      fetchProductosProveedor();
    } catch (error) {
      console.error('Error al eliminar producto del proveedor', error);
    }
    setLoading(false);
  };

  const handleDeleteProveedor = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${apiBaseUrl}/proveedores/${id}`);
      fetchProveedores();
    } catch (error) {
      console.error('Error al eliminar proveedor', error);
    }
    setLoading(false);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
      setSelectedCategoria('');
      setSelectedProveedor('');
      setSearchTerm('');
    }
  };

  const handleProveedorClick = (proveedorId) => {
    const productos = productosProveedor.filter(producto => producto.proveedor.id === proveedorId);
    setSelectedProveedorProductos(productos);
    setOpenProveedorProductosDialog(true);
  };

  const filteredProductos = productosProveedor.filter(producto =>
    (!selectedCategoria || producto.categoria.id === selectedCategoria) &&
    (!selectedProveedor || producto.proveedor.id === selectedProveedor) &&
    (!searchTerm || producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProveedores = proveedores.filter(proveedor =>
    (!selectedCategoria || proveedor.categoria.id === selectedCategoria) &&
    (!searchTerm || proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categoriasToDisplay = view === 'productos' ? categoriasProductos : categoriasProveedores;

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Centro de Proveedores
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpenProductoDialog(true)}
          sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}
        >
          Agregar Producto
        </Button>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpenProveedorDialog(true)}
          sx={{ mt: 2, ml: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}
        >
          Agregar Proveedor
        </Button>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpenCategoriasDialog(true)}
          sx={{ mt: 2, ml: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}
        >
          Administrar Categorías
        </Button>

        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => setOpenPedidoDialog(true)}
          sx={{ mt: 2, ml: 2, backgroundColor: '#FF5733', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#C70039' }, }}
        >
          Pedido a Proveedores
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{ mt: 2, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <ToggleButton value="productos" sx={{ borderRadius: '10px 0 0 10px', fontWeight: 'bold' }}>Productos</ToggleButton>
          <ToggleButton value="proveedores" sx={{ borderRadius: '0 10px 10px 0', fontWeight: 'bold' }}>Proveedores</ToggleButton>
          <ToggleButton value="pedidos" sx={{ borderRadius: '0 10px 10px 0', fontWeight: 'bold' }}>Pedidos</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControl sx={{ width: 200, mr: 2 }}>
          <InputLabel id="categoria-label">Categoría</InputLabel>
          <Select
            labelId="categoria-label"
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            label="Categoría"
          >
            <MenuItem value=""><em>Todos</em></MenuItem>
            {categoriasToDisplay.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {view === 'productos' && (
          <FormControl sx={{ width: 200, mr: 2 }}>
            <InputLabel id="proveedor-label">Proveedor</InputLabel>
            <Select
              labelId="proveedor-label"
              value={selectedProveedor}
              onChange={(e) => setSelectedProveedor(e.target.value)}
              label="Proveedor"
            >
              <MenuItem value=""><em>Todos</em></MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre"
          sx={{ width: 200 }}
        />
      </Box>

      {loading ? <CircularProgress /> : (
        <Grid container spacing={4} sx={{ mt: 5 }}>
          {view === 'productos' && filteredProductos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <ProductoCard 
                producto={producto} 
                onEdit={() => handleEditProducto(producto)} 
                onDelete={() => handleDeleteProducto(producto.id)} 
              />
            </Grid>
          ))}
          {view === 'proveedores' && filteredProveedores.map((proveedor) => (
            <Grid item xs={12} sm={6} md={4} key={proveedor.id}>
              <ProveedorCard 
                proveedor={proveedor} 
                onClick={() => handleProveedorClick(proveedor.id)} 
                onEdit={() => handleEditProveedor(proveedor)}
                onDelete={() => handleDeleteProveedor(proveedor.id)} 
              />
            </Grid>
          ))}
          {view === 'pedidos' && (
            <Grid item xs={12}>
              <PedidosList />
            </Grid>
          )}
        </Grid>
      )}

      <ProductoDialog
        open={openProductoDialog}
        onClose={() => setOpenProductoDialog(false)}
        onSave={handleAddOrEditProductoProveedor}
        proveedores={proveedores}
        categorias={categoriasProductos}
        producto={editingProduct}
      />

      <ProveedorDialog
        open={openProveedorDialog}
        onClose={() => setOpenProveedorDialog(false)}
        onSave={handleAddOrEditProveedor}
        categorias={categoriasProveedores}
        proveedor={editingSupplier}
      />

      <CategoriaDialog
        open={openCategoriaDialog}
        onClose={() => setOpenCategoriaDialog(false)}
        onSave={handleAddCategoria}
      />

      <CategoriasDialog
        open={openCategoriasDialog}
        onClose={() => setOpenCategoriasDialog(false)}
        categorias={[...categoriasProductos, ...categoriasProveedores]}
        onSave={handleAddCategoria}
        onEdit={handleEditCategoria}
        onDelete={handleDeleteCategoria}
      />

      <ProveedorProductosDialog
        open={openProveedorProductosDialog}
        onClose={() => setOpenProveedorProductosDialog(false)}
        productos={selectedProveedorProductos}
      />

      <PedidoDialog
        open={openPedidoDialog}
        onClose={() => setOpenPedidoDialog(false)}
        productos={productosProveedor}
        proveedores={proveedores}
      />
    </Container>
  );
}

export default ProveedoresScreen;

