import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, Typography, IconButton,
  InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  TableContainer
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';

const PrimaryColor = "#5A67D8";
const SecondaryColor = "#333";

const StyledDialogTitle = styled(DialogTitle)({
  color: PrimaryColor,
  fontWeight: 'bold'
});

const StyledButton = styled(Button)({
  backgroundColor: PrimaryColor,
  color: 'white',
  '&:hover': {
    backgroundColor: '#4C51BF'
  }
});

const StyledTableCell = styled(TableCell)({
  backgroundColor: SecondaryColor,
  color: 'white',
  fontWeight: 'bold'
});

const InventoryDialog = ({ open, handleClose, productos, handleSaveMovement, bodegas }) => {
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [comentario, setComentario] = useState('');
  const [cambiosStock, setCambiosStock] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [bodegaOrigen, setBodegaOrigen] = useState('');
  const [bodegaDestino, setBodegaDestino] = useState('');

  const handleTipoMovimientoChange = (event) => {
    setTipoMovimiento(event.target.value);
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleCantidadChange = (id, cantidad) => {
    setCambiosStock(prev => ({ ...prev, [id]: cantidad }));
  };

  const handleSave = () => {
    const bodegaOrigenId = tipoMovimiento === 'salida' ? bodegaDestino : null;
    const bodegaDestinoId = tipoMovimiento === 'entrada' ? bodegaDestino : null;

    handleSaveMovement(tipoMovimiento, comentario, cambiosStock, bodegaOrigenId, bodegaDestinoId);
    handleClose();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleAddProduct = (productId) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
    setCambiosStock(prev => {
      const newStockChanges = { ...prev };
      delete newStockChanges[productId];
      return newStockChanges;
    });
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>Registrar Movimiento de Inventario</StyledDialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-movimiento-label">Tipo de Movimiento</InputLabel>
          <Select
            labelId="tipo-movimiento-label"
            value={tipoMovimiento}
            onChange={handleTipoMovimientoChange}
          >
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="salida">Salida</MenuItem>
            <MenuItem value="traslado">Traslado</MenuItem>
          </Select>
        </FormControl>
        {tipoMovimiento === 'traslado' && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Bodega de Origen</InputLabel>
              <Select
                value={bodegaOrigen}
                onChange={(event) => setBodegaOrigen(event.target.value)}
                label="Bodega de Origen"
              >
                {bodegas.map((bodega) => (
                  <MenuItem key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Bodega de Destino</InputLabel>
              <Select
                value={bodegaDestino}
                onChange={(event) => setBodegaDestino(event.target.value)}
                label="Bodega de Destino"
              >
                {bodegas.map((bodega) => (
                  <MenuItem key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {tipoMovimiento !== 'traslado' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Bodega</InputLabel>
            <Select
              value={bodegaDestino}
              onChange={(event) => setBodegaDestino(event.target.value)}
              label="Bodega"
            >
              {bodegas.map((bodega) => (
                <MenuItem key={bodega.id} value={bodega.id}>
                  {bodega.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
        <Grid container spacing={2} style={{ marginTop: '16px', marginBottom: '16px' }}>
          {search && filteredProductos.length > 0 ? (
            filteredProductos.map(producto => (
              <Grid item xs={12} key={producto.id}>
                <Paper elevation={3} style={{ padding: '8px' }}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Typography>{producto.nombre}</Typography>
                    <IconButton onClick={() => handleAddProduct(producto.id)} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Paper>
              </Grid>
            ))
          ) : search ? (
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: '16px' }}>
              No se encontraron productos.
            </Typography>
          ) : null}
        </Grid>
        {selectedProducts.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Producto</StyledTableCell>
                  <StyledTableCell align="right">Cantidad</StyledTableCell>
                  <StyledTableCell align="right">Acciones</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map(productId => {
                  const producto = productos.find(p => p.id === productId);
                  return (
                    <TableRow key={productId}>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={cambiosStock[productId] || ''}
                          onChange={(e) => handleCantidadChange(productId, e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleRemoveProduct(productId)} color="secondary">
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TextField
          label="Comentario"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={comentario}
          onChange={handleComentarioChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <StyledButton onClick={handleSave} color="primary">Guardar</StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryDialog;
