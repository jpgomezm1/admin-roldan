import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Container, CircularProgress, Tabs, Tab, AppBar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProductoCard from '../../components/ProductCard/ProductCard';
import ProductoDialog from '../../components/ProductDialog/ProductDialog';
import ListaPrecios from './ListaPrecios'; // Importamos el nuevo componente
import TabPanel from '../GastosScreen/TabPanel';

const PaginaProductos = () => {
    const [open, setOpen] = useState(false);
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', imagen: null, categoria: '', descripcion: '' });
    const [editMode, setEditMode] = useState(false);
    const [productoId, setProductoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchProductos();
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

    const handleAddProducto = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('nombre', nuevoProducto.nombre);
        formData.append('precio', nuevoProducto.precio);
        formData.append('categoria', nuevoProducto.categoria);
        formData.append('descripcion', nuevoProducto.descripcion || '');
        if (nuevoProducto.imagen) {
            formData.append('imagen', nuevoProducto.file);
        }

        try {
            const response = await axios({
                method: editMode ? 'PUT' : 'POST',
                url: `${apiBaseUrl}/productos${editMode ? `/${productoId}` : ''}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (editMode) {
                setProductos(productos.map(p => (p.id === productoId ? response.data : p)));
            } else {
                setProductos([...productos, response.data]);
            }
            handleClose();
        } catch (error) {
            console.error('Error al agregar o editar el producto', error.response);
        }
        setLoading(false);
    };

    const handleEdit = producto => {
        setNuevoProducto({ ...producto, imagen: null });
        setProductoId(producto.id);
        setEditMode(true);
        setOpen(true);
    };

    const handleDelete = async producto => {
        setLoading(true);
        try {
            await axios.delete(`${apiBaseUrl}/productos/${producto.id}`);
            setProductos(productos.filter(p => p.id !== producto.id));
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
        setNuevoProducto({ nombre: '', precio: '', imagen: null, categoria: '', descripcion: '' });
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'imagen' && files) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            setNuevoProducto(prev => ({ ...prev, imagen: imageUrl, file }));
        } else {
            setNuevoProducto(prev => ({ ...prev, [name]: e.target.value }));
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
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
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={handleClickOpen} variant="contained" size="large" sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}>
                        Agregar Producto
                    </Button>
                    {loading ? <CircularProgress /> : (
                        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
                            {productos.map((producto, index) => (
                                <ProductoCard key={index} producto={producto} onDelete={handleDelete} onEdit={handleEdit} />
                            ))}
                        </Grid>
                    )}
                    <ProductoDialog
                        open={open}
                        handleClose={handleClose}
                        handleChange={handleChange}
                        handleAddProducto={handleAddProducto}
                        nuevoProducto={nuevoProducto}
                        loading={loading}
                        editMode={editMode}
                    />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ListaPrecios />
                </TabPanel>
            </Container>
        </div>
    );
};

export default PaginaProductos;


