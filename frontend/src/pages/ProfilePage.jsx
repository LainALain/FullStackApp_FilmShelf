import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile } from '../api/backend';
import { 
  Typography, 
  Button, 
  Grid, 
  Avatar, 
  Paper, 
  Box, 
  CircularProgress 
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();
  const nav = useNavigate();

  const reloadProfile = () => {
    getProfile(username).then(setProfile);
  };

  useEffect(() => {
    reloadProfile();
  }, [username]);

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const { user: u, movies = [], followers = [], following = [] } = profile;

  return (
    <Box maxWidth={900} mx="auto" mt={4} px={2}>
      <Paper elevation={3} sx={{ p: 3, mb: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={u.avatar || undefined}
          alt={u.username}
          sx={{ width: 96, height: 96 }}
        />
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {u.username}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {u.email}
          </Typography>
          {u.description && (
            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
              {u.description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            Зарегистрирован: {new Date(u.created_at).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Избранные фильмы
      </Typography>
      {movies.length === 0 ? (
        <Typography color="text.secondary" mb={4}>
          Здесь пока нет добавленных фильмов.
        </Typography>
      ) : (
        <Grid container spacing={3} mb={4}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.imdbID}>
              <MovieCard movie={movie} onFavorited={reloadProfile} />
            </Grid>
          ))}
        </Grid>
      )}

      <Button variant="outlined" onClick={() => nav('/')} fullWidth>
        Перейти к поиску фильмов
      </Button>
    </Box>
  );
}
