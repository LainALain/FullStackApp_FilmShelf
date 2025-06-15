import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieInfo } from '../api/omdb';
import { getComments, postComment } from '../api/backend';
import Comment from '../components/Comment';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const m = await getMovieInfo(id);
        setMovie(m);

        const comm = await getComments(id);
        setComments(comm);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const addComment = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await postComment(id, text, user.token);
      const comm = await getComments(id);
      setComments(comm);
      setText('');
    } catch (e) {
      alert('Ошибка при добавлении комментария');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <Box mt={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Typography mt={4} align="center" color="error">
        Информация о фильме не найдена.
      </Typography>
    );
  }

  return (
    <Box maxWidth={900} mx="auto" px={2} mt={4} mb={6}>
      
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        {movie.Title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {movie.Year} &bull; {movie.Genre} &bull; {movie.Runtime}
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={4}
        mb={4}
        alignItems="flex-start"
      >
        <Box
          component="img"
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
          alt={movie.Title}
          sx={{
            width: { xs: '100%', md: 300 },
            borderRadius: 2,
            boxShadow: 3,
            objectFit: 'cover',
          }}
        />
        <Typography variant="body1" sx={{ flex: 1 }}>
          {movie.Plot}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" gutterBottom>
        Комментарии ({comments.length})
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 3,
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {comments.length === 0 && (
          <Typography color="text.secondary">Пока нет комментариев</Typography>
        )}

        {comments.map((c) => (
          <Paper key={c.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Comment
              avatar={c.avatar}
              username={c.username}
              text={c.content}
              date={c.created_at}
            />
          </Paper>
        ))}
      </Box>

      {user ? (
        <Box>
          <TextField
            label="Ваш комментарий"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={addComment}
            disabled={posting || !text.trim()}
          >
            {posting ? 'Отправка...' : 'Отправить'}
          </Button>
        </Box>
      ) : (
        <Typography color="text.secondary">
          Войдите, чтобы оставить комментарий
        </Typography>
      )}
    </Box>
  );
}
