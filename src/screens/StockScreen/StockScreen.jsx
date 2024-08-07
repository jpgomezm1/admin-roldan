import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, IconButton, InputAdornment, Button, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Grid} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import InventoryDialog from './InventoryDialog';
import MovimientosDialog from './MovimientosDialog';
import { useSelector } from 'react-redux';
import SummaryCard from './SummaryCard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ListAltIcon from '@mui/icons-material/ListAlt';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

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

const StockScreen = () => {
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState('general');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState({});
  const [stockLimits, setStockLimits] = useState({});
  const [editing, setEditing] = useState({});
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimientosDialogOpen, setMovimientosDialogOpen] = useState(false);
  const [newBodegaDialogOpen, setNewBodegaDialogOpen] = useState(false);
  const [newBodegaName, setNewBodegaName] = useState('');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchBodegas();
    fetchProductos();
  }, []);

  useEffect(() => {
    const uniqueCategorias = [...new Set(productos.map((p) => p.categoria))];
    setCategorias(uniqueCategorias);
    const uniqueSubcategorias = [...new Set(productos.map((p) => p.subcategoria))];
    setSubcategorias(uniqueSubcategorias);
  }, [productos]);

  const fetchBodegas = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/bodegas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          Authorization: `Bearer ${token}`,
        },
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
    fetchProductos();
  };

  const handleCategoriaChange = (event) => {
    setCategoriaFiltro(event.target.value);
  };

  const handleSubcategoriaChange = (event) => {
    setSubcategoriaFiltro(event.target.value);
  };

  const handleStockChange = (id, cantidad) => {
    setStockChanges((prev) => ({ ...prev, [id]: cantidad }));
  };

  const handleStockLimitChange = (id, limite) => {
    setStockLimits((prev) => ({ ...prev, [id]: limite }));
  };

  const handleSaveStock = async (id) => {
    const cantidad = stockChanges[id];
    const limite = stockLimits[id] || 50;
    if (cantidad !== undefined) {
      try {
        const response = await axios.post(
          `${apiBaseUrl}/productos/${id}/stock`,
          {
            cantidad,
            limite,
            bodega_id: bodegaSeleccionada,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEditing((prev) => ({ ...prev, [id]: false }));
        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id === id
              ? {
                  ...producto,
                  stocks: {
                    ...producto.stocks,
                    [bodegaSeleccionada]: response.data.stock,
                  },
                }
              : producto
          )
        );
        alert('Stock y límite actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el stock', error);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditing((prev) => ({ ...prev, [id]: true }));
  };

  const handleCancelClick = (id) => {
    setEditing((prev) => ({ ...prev, [id]: false }));
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
        const response = await axios.post(
          `${apiBaseUrl}/bodegas`,
          { nombre: newBodegaName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBodegas([...bodegas, response.data]);
        setNewBodegaName('');
        setNewBodegaDialogOpen(false);
      } catch (error) {
        console.error('Error al agregar la nueva bodega', error);
      }
    }
  };

  const handleSaveMovement = async (
    tipoMovimiento,
    comentario,
    cambiosStock,
    bodegaOrigenId,
    bodegaDestinoId
  ) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/inventarios/movimiento`,
        {
          tipo: tipoMovimiento,
          comentario: comentario,
          cambiosStock: cambiosStock,
          bodegaOrigenId: bodegaOrigenId,
          bodegaDestinoId: bodegaDestinoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.mensaje);
      fetchProductos();
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

  const calcularValorInventario = (producto, stock) => {
    return stock * producto.costo;
  };

  const calcularLimiteStockTotal = (producto) => {
    // Ensure stockLimits are summed as integers
    return bodegas.reduce((total, bodega) => {
      const limitKey = `${producto.id}-${bodega.id}`;
      const stockLimit = parseInt(stockLimits[limitKey] || 50); // Default to 50 if undefined, ensuring it's treated as an integer
      return total + stockLimit;
    }, 0);
  };

  const calcularTotales = () => {
    let totalUnidades = 0;
    let totalMercancia = 0;
    let totalReferencias = 0;

    productos.forEach((producto) => {
      const stock =
        bodegaSeleccionada && bodegaSeleccionada !== 'general'
          ? producto.stocks[bodegaSeleccionada] || 0
          : calcularStockTotal(producto);

      if (stock > 0) {
        totalReferencias += 1;
      }

      totalUnidades += stock;
      totalMercancia += calcularValorInventario(producto, stock);
    });

    return { totalUnidades, totalMercancia, totalReferencias };
  };

  const { totalUnidades, totalMercancia, totalReferencias } = calcularTotales();

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(search.toLowerCase()) &&
    (categoriaFiltro === '' || producto.categoria === categoriaFiltro) &&
    (subcategoriaFiltro === '' || producto.subcategoria === subcategoriaFiltro)
  );

  const getStockStatus = (stock, limite) => {
    if (stock > limite) {
      return { label: 'Abastecido', color: 'success' };
    } else if (stock > 0) {
      return { label: 'Bajo stock', color: 'error' };
    } else {
      return { label: 'Agotado', color: 'info' };
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Precio</StyledTableCell>
            <StyledTableCell>Costo</StyledTableCell>
            <StyledTableCell>Categoría</StyledTableCell>
            <StyledTableCell>Stock</StyledTableCell>
            <StyledTableCell>Límite de Stock</StyledTableCell>
            <StyledTableCell>Valor en Inventario</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
            <StyledTableCell>Estatus de Stock</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProductos.map((producto) => {
            const stockTotal = calcularStockTotal(producto);
            const valorInventarioTotal = calcularValorInventario(producto, stockTotal);
            const stockBodega =
              bodegaSeleccionada && bodegaSeleccionada !== 'general'
                ? producto.stocks[bodegaSeleccionada] || 0
                : stockTotal;
            const limiteStock =
              bodegaSeleccionada === 'general'
                ? calcularLimiteStockTotal(producto)
                : stockLimits[`${producto.id}-${bodegaSeleccionada}`] || 50;
            const valorInventarioBodega = calcularValorInventario(
              producto,
              stockBodega
            );
            const { label, color } = getStockStatus(stockBodega, limiteStock);

            return (
              <TableRow key={producto.id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{formatCurrency(producto.precio)}</TableCell>
                <TableCell>{formatCurrency(producto.costo)}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>
                  {editing[producto.id] ? (
                    <>
                      <TextField
                        label="Stock"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={
                          stockChanges[producto.id] !== undefined
                            ? stockChanges[producto.id]
                            : producto.stocks &&
                              producto.stocks[bodegaSeleccionada] !== undefined
                            ? producto.stocks[bodegaSeleccionada]
                            : calcularStockTotal(producto) // Calculate total stock for 'general' case
                        }
                        onChange={(e) =>
                          handleStockChange(producto.id, e.target.value)
                        }
                      />
                      <TextField
                        label="Límite de Stock"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={stockLimits[`${producto.id}-${bodegaSeleccionada}`] || limiteStock}
                        onChange={(e) =>
                          handleStockLimitChange(`${producto.id}-${bodegaSeleccionada}`, e.target.value)
                        }
                      />
                      <IconButton
                        onClick={() => handleSaveStock(producto.id)}
                        sx={{ color: '#5E55FE' }}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleCancelClick(producto.id)}
                        color="secondary"
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : bodegaSeleccionada === 'general' ? (
                    stockTotal // Show total stock for 'general'
                  ) : (
                    producto.stocks[bodegaSeleccionada] || 0
                  )}
                </TableCell>
                <TableCell>{limiteStock}</TableCell>
                <TableCell>
                  {bodegaSeleccionada && bodegaSeleccionada !== 'general'
                    ? formatCurrency(valorInventarioBodega)
                    : formatCurrency(valorInventarioTotal)}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(producto.id)}
                    sx={{ color: '#5E55FE' }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Chip label={label} color={color} sx={{ mt: 1 }} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" style={{ minHeight: '100vh', paddingTop: '20px' }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4} md={4}>
          <SummaryCard
            title="Total Unidades en Inventario"
            value={totalUnidades}
            icon={<InventoryIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <SummaryCard
            title="Total Mercancía en Inventario"
            value={formatCurrency(totalMercancia)}
            icon={<AttachMoneyIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <SummaryCard
            title="Total de Referencias"
            value={totalReferencias}
            icon={<ListAltIcon fontSize="large" />}
          />
        </Grid>
      </Grid>
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
      <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
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
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Subcategoría</InputLabel>
            <Select
              value={subcategoriaFiltro}
              onChange={handleSubcategoriaChange}
              label="Subcategoría"
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {subcategorias.map((subcategoria, index) => (
                <MenuItem key={index} value={subcategoria}>
                  {subcategoria}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Bodega</InputLabel>
            <Select
              value={bodegaSeleccionada}
              onChange={handleBodegaChange}
              label="Bodega"
            >
              <MenuItem value="general">General</MenuItem>
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
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={handleDialogOpen}
        size="medium"
        sx={{
          my: 2,
          backgroundColor: '#5E55FE',
          color: 'white',
          borderRadius: '10px',
          '&:hover': { backgroundColor: '#7b45a1' },
          mr: 1,
        }}
      >
        Registrar Movimiento de Inventario
      </Button>
      <Button
        variant="contained"
        onClick={handleMovimientosDialogOpen}
        size="medium"
        sx={{
          my: 2,
          backgroundColor: '#5E55FE',
          color: 'white',
          borderRadius: '10px',
          '&:hover': { backgroundColor: '#7b45a1' },
        }}
      >
        Ver Movimientos de Inventario
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        renderTable()
      )}
      <InventoryDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        productos={productos}
        handleSaveMovement={handleSaveMovement}
        bodegas={bodegas}
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
