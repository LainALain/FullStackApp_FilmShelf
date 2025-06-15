import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, IconButton } from '@mui/material';
import StarBorder from '@mui/icons-material/StarBorder';
import { toggleFavorite } from '../api/backend';
import { useAuth } from '../context/AuthContext';

export default function MovieCard({ movie, onFavorited }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hover, setHover] = useState(false);

  const onFav = async (e) => {
    e.stopPropagation(); 
    if (!user) return;
    try {
      await toggleFavorite(movie.imdbID, user.token);
      if (onFavorited) onFavorited(); // Обновляем профиль
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <Card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/movies/${movie.imdbID}`)}
      className="relative cursor-pointer"
    >
      <CardMedia
        component="img"
        height="240"
        image={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
        alt={movie.Title}
        sx={{ filter: hover ? 'blur(4px)' : 'none' }}
      />
      {hover && (
        <>
          <CardContent className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white">
            {movie.Title} ({movie.Year})
          </CardContent>
          <IconButton
            sx={{ position: 'absolute', bottom: 8, right: 8, color: 'white' }}
            onClick={onFav}
          >
            <StarBorder />
          </IconButton>
        </>
      )}
    </Card>
  );
}
