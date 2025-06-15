import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getComments, addComment } from '../controllers/commentControllers.js';

const router = Router();

router.get('/:omdbId', getComments);
router.post('/:omdbId', auth, addComment);

export default router;
