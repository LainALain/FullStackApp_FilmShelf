import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box, Container } from '@mui/material';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../api/omdb';

export default function TopListPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const topMovies = [
    'Citizen Kane',
    'The Godfather',
    'Casablanca',
    'Raging Bull',
    'Singin’ in the Rain',
    'Gone with the Wind',
    'Lawrence of Arabia',
    'Schindler’s List',
    'Vertigo',
    'The Wizard of Oz',
    'City Lights',
    'The Searchers',
    'Star Wars',
    'Psycho',
    '2001: A Space Odyssey',
    'Sunset Blvd.',
    'The Graduate',
    'The General',
    'On the Waterfront',
    'It’s a Wonderful Life',
    'Chinatown',
    'Some Like It Hot',
    'The Grapes of Wrath',
    'E.T. The Extra-Terrestrial',
    'To Kill A Mockingbird',
    'Mr. Smith Goes to Washington',
    'High Noon',
    'All About Eve',
    'Double Indemnity',
    'Apocalypse Now',
    'The Maltese Falcon',
    'The Godfather Part II',
    'One Flew Over the Cuckoo’s Nest',
    'Snow White and the Seven Dwarfs',
    'Annie Hall',
    'The Bridge on the River Kwai',
    'The Best Years of Our Lives',
    'The Treasure of the Sierra Madre',
    'Dr. Strangelove',
    'The Sound of Music',
    'King Kong',
    'Bonnie and Clyde',
    'Midnight Cowboy',
    'The Philadelphia Story',
    'Shane',
    'It Happened One Night',
    'A Streetcar Named Desire',
    'Rear Window',
    'Intolerance',
    'The Lord of the Rings: The Fellowship of the Ring',
    'West Side Story',
    'Taxi Driver',
    'The Deer Hunter',
    'MASH',
    'North By Northwest',
    'Jaws',
    'Rocky',
    'The Gold Rush',
    'Nashville',
    'Duck Soup',
    'Sullivan’s Travels',
    'American Graffiti',
    'Cabaret',
    'Network',
    'The African Queen',
    'Raiders of the Lost Ark',
    'Who’s Afraid of Virginia Woolf?',
    'Unforgiven',
    'Tootsie',
    'A Clockwork Orange',
    'Saving Private Ryan',
    'The Shawshank Redemption',
    'Butch Cassidy and the Sundance Kid',
    'The Silence of the Lambs',
    'In the Heat of the Night',
    'Forrest Gump',
    'All the President’s Men',
    'Modern Times',
    'The Wild Bunch',
    'The Apartment',
    'Spartacus',
    'Sunrise',
    'Titanic',
    'Easy Rider',
    'A Night at the Opera',
    'Platoon',
    '12 Angry Men',
    'Bringing Up Baby',
    'The Sixth Sense',
    'Swing Time',
    'Sophie’s Choice',
    'Goodfellas',
    'The French Connection',
    'Pulp Fiction',
    'The Last Picture Show',
    'Do the Right Thing',
    'Blade Runner',
    'Yankee Doodle Dandy',
    'Toy Story',
    'Ben-Hur',
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
