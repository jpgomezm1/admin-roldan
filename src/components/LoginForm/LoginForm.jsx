import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';
import axios from 'axios';

import logo from '../../assets/logo33.png';
import backgroundImage from '../../assets/fondo.png';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { username: email, password });
            const { access_token, logo_url, establecimiento } = response.data;
            dispatch(login({ token: access_token, logo_url, establecimiento }));
        } catch (error) {
            console.error('Error during login', error);
            setSnackbarMessage('Usuario o contraseña incorrectos');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '300px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <img src={logo} alt="logo" style={{ width: '120px', marginBottom: '20px' }} />
                <Typography variant="h4" sx={{ fontFamily: 'Poppins', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>Ingresar</Typography>
                <TextField
                    label="Usuario"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ marginBottom: '20px', width: '100%', height: '56px' }}
                />
                <TextField
                    label="Contraseña"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: '20px', width: '100%', height: '56px' }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: '#5E55FE', '&:hover': { backgroundColor: '#7b45a1' }, color: 'white', fontFamily: 'Poppins', borderRadius: '10px', textTransform: 'none', padding: '10px 7px', fontSize: '17px', marginTop: '7px', marginBottom: '5px', marginLeft: '7px', fontWeight: 'bold'
                    }}
                >
                    Iniciar sesión
                </Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginForm;
