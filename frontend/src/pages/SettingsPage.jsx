import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { getMySettings, updateMySettings, deleteAccount } from '../api/backend';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [data, setData] = useState({ username: '', email: '', description: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getMySettings(user.token);
        setData(settings);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [user]);

  const handleChange = (field) => (e) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMySettings(data, user.token);
      alert('Настройки сохранены');
    } catch {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount(user.token);
      logout();
      nav('/register');
    } catch {
      alert('Ошибка при удалении аккаунта');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box mt={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={480} mx="auto" mt={6} px={2}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Настройки профиля
        </Typography>

        <TextField
          label="Имя пользователя"
          fullWidth
          margin="normal"
          value={data.username}
          onChange={handleChange('username')}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          value={data.email}
          onChange={handleChange('email')}
        />
        <TextField
          label="Описание"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={data.description}
          onChange={handleChange('description')}
        />
        <TextField
          label="URL аватара"
          fullWidth
          margin="normal"
          value={data.avatar}
          onChange={handleChange('avatar')}
        />

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={() => setDeleteDialogOpen(true)}
          disabled={deleting}
        >
          {deleting ? 'Удаление...' : 'Удалить аккаунт'}
        </Button>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить аккаунт? Это действие необратимо.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={deleting}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
