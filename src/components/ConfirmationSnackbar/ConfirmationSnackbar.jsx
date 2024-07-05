import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function ConfirmationSnackbar({ open, onClose, message, severity }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={severity || 'success'} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ConfirmationSnackbar;