import axios from 'axios';

export const searchMovies = q =>
  axios
    .get('/movies/search', { params: { title: q } })
    .then(r => r.data || []);

export const getMovieInfo = omdbId =>
  axios
    .get(`/movies/${omdbId}`)
    .then(r => r.data);
