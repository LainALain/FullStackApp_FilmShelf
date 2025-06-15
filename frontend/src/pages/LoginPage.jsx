import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/settings');
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Paper
        elevation={6}
        sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}
      >
        <Typography variant="h4" component="h1" align="center" mb={3} fontWeight="bold">
          Вход в аккаунт
        </Typography>
        <form onSubmit={handle} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            autoComplete="email"
          />
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 1, py: 1.5 }}
          >
            Войти
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={() => nav('/register')}
            sx={{ mt: 1 }}
          >
            Регистрация
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
