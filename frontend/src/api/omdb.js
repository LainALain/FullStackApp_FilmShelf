import axios from 'axios';

const BASE = process.env.REACT_APP_OMDB_API_URL;

export const searchMovies = q =>
axios.get(`${BASE}`, { params: { title: q } }).then(r => r.data || []);

export const getMovieInfo = omdbId =>
  axios
    .get(`/movies/${omdbId}`)
    .then(r => r.data);