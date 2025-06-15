import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Box, Typography } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../api/omdb';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultTitles = [
    'Citizen Kane',
    'The Godfather',
    'Casablanca',
    'Raging Bull',
    'Singin’ in the Rain',
    'Gone with the Wind',
    'Lawrence of Arabia',
    'Schindler’s List',
  ];

  const load = async (q) => {
    setLoading(true);
    try {
      if (!q) {
        const searchResults = await Promise.all(
          defaultTitles.map(async (title) => {
            const res = await searchMovies(title);
            return res[0]; 
          })
        );
        setMovies(searchResults.filter(Boolean)); 
      } else if (q.trim()) {
        const res = await searchMovies(q);
        setMovies(res.slice(0, 8));
      }
    } catch (error) {
      console.error('Ошибка поиска фильмов:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); 
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Поиск фильмов
      </Typography>

      <Box display="flex" gap={2} mb={4}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Введите название фильма..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') load(query);
          }}
        />
        <Button variant="contained" onClick={() => load(query)} disabled={loading}>
          Найти
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="body1" color="textSecondary">
            Загрузка...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.length > 0 ? (
            movies.map((m) => (
              <Grid item xs={12} sm={6} md={3} key={m.imdbID}>
                <MovieCard movie={m} />
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" mt={4}>
              <Typography variant="body1" color="textSecondary">
                Фильмы не найдены
              </Typography>
            </Box>
          )}
        </Grid>
      )}

      <Box textAlign="center" mt={5}>
        <Button href="/top" variant="outlined" size="large">
          Смотреть все топ 100
        </Button>
      </Box>
    </Container>
  );
}
