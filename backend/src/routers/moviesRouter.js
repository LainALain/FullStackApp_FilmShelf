import { Router } from 'express';
import { searchMovies, getMovieDetails } from '../controllers/movieControllers.js';

const router = Router();

router.get('/search', searchMovies);
router.get('/:omdbId', getMovieDetails);

export default router;
