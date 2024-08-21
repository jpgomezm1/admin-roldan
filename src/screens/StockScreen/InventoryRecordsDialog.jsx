import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  Grid, Card, CardContent, Typography, Box, IconButton, Alert, Tooltip, Paper, Table, TableHead,
  TableContainer, TableRow, TableBody, Switch, FormControlLabel, CircularProgress, Avatar, TableCell
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ListIcon from '@mui/icons-material/List';
import GridOnIcon from '@mui/icons-material/GridOn';
import axios from 'axios';
import { useSelector } from 'react-redux';

const InventoryRecordsDialog = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(true);
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (open) {
      fetchInventoryRecords();
    }
  }, [open]);

  const fetchInventoryRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/inventarios/ejecutados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInventoryRecords(response.data);
    } catch (error) {
      console.error('Error al obtener los registros de inventarios', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
  };

  const handleViewModeChange = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  const totalOK = inventoryRecords.filter(record => record.detalles.reduce((acc, detalle) => acc + detalle.diferencia, 0) === 0).length;
  const totalWithIssues = inventoryRecords.length - totalOK;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Registros de Inventarios
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box mb={3}>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h6">
                      Resumen General
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Total Inventarios: {inventoryRecords.length}
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      Inventarios OK: {totalOK}
                    </Typography>
                    <Typography variant="body1" color="error.main">
                      Inventarios con Discrepancias: {totalWithIssues}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={viewMode === 'list'}
                          onChange={handleViewModeChange}
                          color="primary"
                          icon={<GridOnIcon />}
                          checkedIcon={<ListIcon />}
                        />
                      }
                      label="Vista Lista"
                    />
                  </Grid>
                </Grid>
              </Box>

              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {inventoryRecords.map((record) => {
                    const totalDifference = record.detalles.reduce((acc, detalle) => acc + detalle.diferencia, 0);
                    const isInventoryOk = totalDifference === 0;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={record.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderColor: isInventoryOk ? 'success.main' : 'warning.main',
                            transition: 'transform 0.3s',
                            '&:hover': {
                              transform: 'scale(1.03)',
                            },
                          }}
                        >
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Avatar sx={{ bgcolor: isInventoryOk ? 'success.main' : 'warning.main' }}>
                                {isInventoryOk ? <CheckCircleIcon /> : <WarningIcon />}
                              </Avatar>
                              <Tooltip title="Ver detalles">
                                <IconButton onClick={() => handleViewDetails(record)} color="primary">
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                              {new Date(record.fecha_ejecucion).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Bodega: {record.bodega_nombre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Responsable: {record.responsable}
                            </Typography>
                            <Typography variant="body2" mt={2}>
                              {isInventoryOk ? 'Inventario OK' : `Discrepancia: ${totalDifference} unidades`}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'grey.200' }}>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Bodega</TableCell>
                        <TableCell>Responsable</TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventoryRecords.map((record) => {
                        const totalDifference = record.detalles.reduce((acc, detalle) => acc + detalle.diferencia, 0);
                        const isInventoryOk = totalDifference === 0;
                        return (
                          <TableRow key={record.id} hover>
                            <TableCell>{new Date(record.fecha_ejecucion).toLocaleDateString()}</TableCell>
                            <TableCell>{record.bodega_nombre}</TableCell>
                            <TableCell>{record.responsable}</TableCell>
                            <TableCell align="center">
                              {isInventoryOk ? (
                                <Typography color="success.main">OK</Typography>
                              ) : (
                                <Typography color="error.main">Discrepancia</Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton onClick={() => handleViewDetails(record)} color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedRecord && (
        <Dialog open={Boolean(selectedRecord)} onClose={() => setSelectedRecord(null)} fullWidth maxWidth="md">
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            Detalles del Inventario
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {new Date(selectedRecord.fecha_ejecucion).toLocaleString()} - Bodega: {selectedRecord.bodega_nombre}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Responsable: {selectedRecord.responsable}
            </Typography>
            <Box mt={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.200' }}>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad Manual</TableCell>
                      <TableCell align="center">Cantidad Sistema</TableCell>
                      <TableCell align="center">Diferencia</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRecord.detalles.map((detalle, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{detalle.producto_nombre}</TableCell>
                        <TableCell align="center">{detalle.cantidad_manual}</TableCell>
                        <TableCell align="center">{detalle.cantidad_sistema}</TableCell>
                        <TableCell align="center" sx={{ color: detalle.diferencia > 0 ? 'success.main' : detalle.diferencia < 0 ? 'error.main' : 'inherit' }}>
                          {detalle.diferencia > 0 ? `+${detalle.diferencia}` : detalle.diferencia}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRecord(null)} color="primary" variant="outlined">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default InventoryRecordsDialog;
