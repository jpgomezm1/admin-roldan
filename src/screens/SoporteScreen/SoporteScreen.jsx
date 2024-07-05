import React from 'react';
import {Container, Typography, Box, Paper, TextField, Button, Stack, Select, MenuItem, InputLabel, FormControl, Accordion, AccordionSummary, AccordionDetails, Link} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { faqs } from './faqs';
import companyLogo from '../../assets/logo33.png';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';


function SoporteScreen() {
  const [subject, setSubject] = React.useState('');
  const [customSubject, setCustomSubject] = React.useState(''); // Estado adicional para el asunto personalizado
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Aquí deberías agregar la lógica para enviar el asunto (subject o customSubject), y el mensaje al soporte
    // Por ejemplo, podrías hacer una solicitud POST a tu API
    setIsSubmitting(false);
  };

  // Restablecer también el asunto personalizado
  const handleReset = () => {
    setSubject('');
    setCustomSubject('');
    setMessage('');
  };

  const accordionStyles = {
    backgroundColor: '#f9f9f9', // Color de fondo suave
    borderBottom: '1px solid #ddd', // Línea separadora sutil
    '&:before': { // Remover la línea de material-ui por defecto
      display: 'none',
    },
    '&.Mui-expanded': { // Estilos para cuando el acordeón está expandido
      margin: 'auto',
    },
  };

  const accordionSummaryStyles = {
    backgroundColor: '#e7e7e7', // Color de fondo para el summary más oscuro que el details
    borderBottom: '1px solid #ccc',
  };

  const whatsappButtonStyles = {
    mt: 2,
    backgroundColor: '#25D366', // Color oficial de WhatsApp
    color: 'white',
    marginBottom: '-2px',
    '&:hover': {
      backgroundColor: '#128C7E', // Un tono más oscuro para el efecto hover
    },
  };

  const phoneNumber = '573183351733'; // Tu número de teléfono con código de país
  const whatsappMessage = "Hola! Necesito ayuda con el software de Fidelity.";
  
  // Enlace de WhatsApp (asegúrate de incluir el código de país)
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'left', fontWeight: 'bold' }}>
        Centro de Soporte
      </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl fullWidth margin="normal">
            <InputLabel id="subject-label">Asunto</InputLabel>
            <Select
              labelId="subject-label"
              id="subject"
              value={subject}
              label="Asunto"
              onChange={(e) => setSubject(e.target.value)}
            >
              <MenuItem value="facturacion">Facturación</MenuItem>
              <MenuItem value="tecnicos">Problemas Técnicos</MenuItem>
              <MenuItem value="cuenta">Problemas de Cuenta</MenuItem>
              <MenuItem value="feedback">Feedback</MenuItem>
              <MenuItem value="otros">Otro</MenuItem>
            </Select>
          </FormControl>

          {/* Mostrar este campo solo si el usuario selecciona 'Otro' */}
          {subject === 'otros' && (
            <TextField
              fullWidth
              id="custom-subject"
              label="Especifique su asunto"
              margin="normal"
              variant="outlined"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
            />
          )}

          <TextField
            required
            fullWidth
            id="message"
            label="Mensaje"
            margin="normal"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleReset} sx={{color: '#a7a29a', borderColor: '#a7a29a'}}>
              Limpiar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{backgroundColor: '#EFE8DD', color: 'black', '&:hover': { backgroundColor: '#f3eee7' }}}>
              Enviar
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Preguntas Frecuentes
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={accordionStyles}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
              sx={accordionSummaryStyles}
            >
              <Typography><strong>{faq.question}</strong></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="textSecondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box mt={4} textAlign="center">
        <Typography variant="h6" gutterBottom>
          ¿Necesitas ayuda inmediata?
        </Typography>
        <Link href={whatsappLink} target="_blank" underline="none">
          <Button
            variant="contained"
            startIcon={<WhatsAppIcon />}
            sx={whatsappButtonStyles}
          >
            Escribenos al WhatsApp
          </Button>
        </Link>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 2 }}>
          O llámanos al 318-335-1733
        </Typography>
      </Box>

      <Box mt={5} py={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Powered by
        </Typography>
        <img src={companyLogo} alt="Company Logo" style={{ width: '140px', height: 'auto' }} />
        <Box mt={2}>
          <Link href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon sx={{ mx: 1, color: 'black', '&:hover': { transform: 'scale(1.2)' } }} />
          </Link>
          <Link href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <TwitterIcon sx={{ mx: 1, color: 'black', '&:hover': { transform: 'scale(1.2)' } }} />
          </Link>
          <Link href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <InstagramIcon sx={{ mx: 1, color: 'black', '&:hover': { transform: 'scale(1.2)' } }} />
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SoporteScreen;
