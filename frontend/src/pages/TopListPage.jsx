import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box, Container } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../api/omdb';

export default function TopListPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const topMovies = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "The Godfather Part II",
    "12 Angry Men",
    "Schindler's List",
    "The Lord of the Rings: The Return of the King",
    "Pulp Fiction",
    "The Lord of the Rings: The Fellowship of the Ring",
    "The Good, the Bad and the Ugly",
    "Forrest Gump",
    "Fight Club",
    "Inception",
    "The Lord of the Rings: The Two Towers",
    "Star Wars: Episode V - The Empire Strikes Back",
    "The Matrix",
    "Goodfellas",
    "One Flew Over the Cuckoo's Nest",
    "Seven Samurai",
    "Se7en",
    "It's a Wonderful Life",
    "The Silence of the Lambs",
    "City of God",
    "Saving Private Ryan",
    "Interstellar",
    "The Green Mile",
    "Life Is Beautiful",
    "Star Wars",
    "Terminator 2: Judgment Day",
    "Back to the Future",
    "Spirited Away",
    "Psycho",
    "The Pianist",
    "Parasite",
    "Léon: The Professional",
    "The Lion King",
    "Gladiator",
    "American History X",
    "The Usual Suspects",
    "The Departed",
    "The Prestige",
    "The Intouchables",
    "Whiplash",
    "Grave of the Fireflies",
    "The Great Dictator",
    "Hotaru no Haka",
    "Once Upon a Time in the West",
    "Harakiri",
    "Coco",
    "Your Name.",
    "Wall-E",
    "Django Unchained",
    "The Shining",
    "Paths of Glory",
    "Avengers: Endgame",
    "Witness for the Prosecution",
    "Oldboy",
    "Alien",
    "The Dark Knight Rises",
    "Spider-Man: Into the Spider-Verse",
    "Sunset Boulevard",
    "Dr. Strangelove",
    "Princess Mononoke",
    "The Lives of Others",
    "Avengers: Infinity War",
    "Memento",
    "City Lights",
    "Apocalypse Now",
    "Joker",
    "WALL-E",
    "The Hunt",
    "Toy Story",
    "The Truman Show",
    "Amélie",
    "Braveheart",
    "Requiem for a Dream",
    "Cinema Paradiso",
    "The Wolf of Wall Street",
    "3 Idiots",
    "Aliens",
    "Gladiator",
    "The Thing",
    "Inside Out",
    "Toy Story 3",
    "The Incredibles",
    "Up",
    "The Grand Budapest Hotel",
    "The Imitation Game",
    "Inglourious Basterds",
    "Good Will Hunting",
    "Hacksaw Ridge",
    "Mad Max: Fury Road",
    "The Social Network",
    "Shutter Island",
    "Logan",
    "A Beautiful Mind"
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const results = await Promise.all(
          topMovies.map((title) =>
            searchMovies(title)
              .then((res) => res[0])
              .catch(() => null)
          )
        );
        const validMovies = results.filter((movie) => movie);
        setMovies(validMovies);
      } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontWeight: '700', mb: 6 }}
      >
        Топ 100 фильмов за всё время
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={64} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.imdbID}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
