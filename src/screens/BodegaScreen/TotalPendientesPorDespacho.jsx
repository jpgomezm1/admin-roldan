import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  DialogActions,
  Box,
  Avatar,
  useTheme,
  Divider
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import WineBarIcon from '@mui/icons-material/WineBar';

const TotalPendientesPorDespacho = ({ pedidos, open, onClose }) => {
  const theme = useTheme();

  const calcularTotales = () => {
    const totales = {};
    pedidos.forEach((pedido) => {
      if (pedido.estado_entrega === 'Pendiente') {
        JSON.parse(pedido.productos).forEach(({ name, quantity }) => {
          totales[name] = (totales[name] || 0) + quantity;
        });
      }
    });
    return totales;
  };

  const totales = calcularTotales();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#5E55F8', color: theme.palette.primary.contrastText }}>
        Total Pendientes por Despacho
      </DialogTitle>
      <DialogContent>
        <List>
          {Object.entries(totales).map(([producto, cantidad], index) => (
            <Box key={index} sx={{ mb: 1, borderRadius: 2, backgroundColor: theme.palette.background.default, boxShadow: 1, p: 2 }}>
              <ListItem sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                  <WineBarIcon />
                </Avatar>
                <ListItemText
                  primary={<Typography variant="subtitle1" fontWeight="bold">{producto}</Typography>}
                  secondary={<Typography variant="body2" color="textSecondary">Total unidades: {cantidad}</Typography>}
                />
              </ListItem>
              {index < Object.entries(totales).length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ m: 1, backgroundColor: '#5E55F8', borderRadius: '18px' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TotalPendientesPorDespacho;
