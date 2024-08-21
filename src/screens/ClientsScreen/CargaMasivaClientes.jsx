import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    CircularProgress,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

const Input = styled('input')({
    display: 'none',
});

const UploadButton = styled(Button)({
    backgroundColor: '#5E55FE',
    color: 'white',
    borderRadius: '8px',
    marginTop: '5px',
    marginBottom: '20px',
    '&:hover': {
        backgroundColor: '#7b45a1',
    },
});

const CustomTypography = styled(Typography)({
    fontSize: '16px',  // Aumentar el tamaño de la fuente
    lineHeight: '1.6',
    color: '#333',
});

const CargaMasivaClientes = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const token = useSelector((state) => state.auth.token); // Obtener el token

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, seleccione un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', file);

        try {
            setLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/clientes/carga_masiva`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setMessage('Clientes cargados exitosamente');
        } catch (error) {
            console.error('Error al cargar los clientes:', error);
            setMessage('Error al cargar los clientes');
        } finally {
            setLoading(false);
            setOpen(false);  // Cerrar el diálogo después de la carga
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage(''); // Limpiar mensajes al cerrar
    };

    const handleDownloadTemplate = () => {
        // Crear la estructura del Excel
        const wsData = [
            ["Nombre Comercial", "Razón Social", "Teléfono", "Correo", "NIT", "Días de Cartera", "Lista de Precios ID", "Dirección", "Ciudad", "Tipo Cliente"]
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Plantilla Clientes");

        // Descargar el archivo
        XLSX.writeFile(wb, "Plantilla_Carga_Clientes.xlsx");
    };

    return (
        <div>
            <UploadButton
                variant="contained"
                startIcon={<UploadFileIcon />}
                onClick={handleClickOpen}
            >
                Cargar Clientes
            </UploadButton>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Instrucciones para la Carga Masiva de Clientes
                    </Typography>
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
                <DialogContent dividers>
                    <Box mb={2}>
                        <CustomTypography gutterBottom>
                            Para cargar clientes de forma masiva, por favor siga los siguientes pasos:
                        </CustomTypography>
                        <Divider sx={{ my: 2 }} />
                        <CustomTypography variant="body2" gutterBottom>
                            1. Descargue la plantilla de Excel y complete la información de los clientes.
                        </CustomTypography>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleDownloadTemplate}
                            sx={{ 
                                mt: 1, 
                                borderRadius: '8px', 
                                borderColor: '#5E55FE', 
                                color: '#5E55FE',
                                textTransform: 'none',
                                padding: '10px 20px'
                            }}
                        >
                            Descargar Plantilla
                        </Button>
                        <CustomTypography variant="body2" gutterBottom sx={{ mt: 2 }}>
                            2. Asegúrese de que los campos obligatorios están llenos y que la información es correcta.
                        </CustomTypography>
                        <CustomTypography variant="body2" gutterBottom>
                            3. Seleccione el archivo completado usando el botón de abajo.
                        </CustomTypography>
                        <CustomTypography variant="body2" gutterBottom>
                            4. Haga clic en "Subir" para cargar los clientes.
                        </CustomTypography>
                    </Box>
                    <label htmlFor="file-upload">
                        <Input 
                            accept=".xlsx, .xls" 
                            id="file-upload" 
                            type="file" 
                            onChange={handleFileChange} 
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadFileIcon />}
                            sx={{ 
                                mt: 2, 
                                borderRadius: '8px', 
                                borderColor: '#5E55FE', 
                                color: '#5E55FE',
                                padding: '10px 20px',
                                textTransform: 'none'
                            }}
                        >
                            Seleccionar Archivo
                        </Button>
                    </label>
                    {file && (
                        <CustomTypography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Archivo seleccionado: {file.name}
                        </CustomTypography>
                    )}
                    {message && <CustomTypography variant="body2" color="error" style={{ marginTop: '10px' }}>{message}</CustomTypography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#333', textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <UploadButton
                        onClick={handleUpload}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Subir'}
                    </UploadButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CargaMasivaClientes;
