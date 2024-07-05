// styledComponents.js
import { Card, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

export const ProductCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

export const ProductMedia = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'cover',
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
}));
