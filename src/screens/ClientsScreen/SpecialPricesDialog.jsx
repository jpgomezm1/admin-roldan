import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

const SpecialPricesDialog = ({ open, onClose, client }) => {
    const [specialPrices, setSpecialPrices] = useState([]);
    const [products, setProducts] = useState([]);
    const [newPrice, setNewPrice] = useState({productId: '', price: ''});

    useEffect(() => {
        axios.get(`${apiBaseUrl}precios-especiales/${client.id}`)
        .then((res) => {
            setSpecialPrices(res.data);
        })
        .catch((err) => {
            console.error(err);
            });

        axios.get(`${apiBaseUrl}productos`)
        .then((res) => {
            setProducts(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [client]);

    const handleAddPrice = () => {
        const { productId, price } = newPrice;
        axios.post(`${apiBaseUrl}precios-especiales`, { 
            cliente_id : client.id,
            producto_id : productId,
            precio : parseFloat(price)})
        .then((res) => {
            setSpecialPrices([...specialPrices, res.data]);
            setNewPrice({productId: '', price: ''});
        })
        .catch((err) => {
            console.error(err);
        });
    }


    const handleDeletePrice = (id) => {
        axios.delete(`${apiBaseUrl}precios-especiales/${id}`)
        .then(() => {
            setSpecialPrices(specialPrices.filter((item) => item.id !== id));
        })
        .catch((err) => {
            console.error(err);
        });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Precios Especiales</DialogTitle>
            <DialogContent>
                <List>
                    {specialPrices.map((item) => (
                        <ListItem key={item.id}>
                            <ListItemText primary={item.producto.nombre} secondary={`$${item.precio}`} />
                            <IconButton onClick={() => handleDeletePrice(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <TextField
                    select
                    label="Producto"
                    value={newPrice.productId}
                    onChange={(e) => setNewPrice({...newPrice, productId: e.target.value})}
                    fullWidth
                >
                    {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.nombre}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Precio"
                    type="number"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice({...newPrice, price: e.target.value})}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleAddPrice} color="primary" disabled={!newPrice.productId || !newPrice.price}>
                    <AddIcon />
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
  );
};

export default SpecialPricesDialog;