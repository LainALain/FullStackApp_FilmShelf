import { Router } from 'express';
import auth from '../middlewares/auth.js';
import {
  getPublicProfile,
  getMySettings,
  updateMySettings,
  toggleFavorite,
  deleteMyAccount
} from '../controllers/userControllers.js';

const router = Router();

router.get('/settings', auth, getMySettings);
router.put('/settings', auth, updateMySettings);
router.delete('/settings', auth, deleteMyAccount);
router.post('/favorites/toggle', auth, toggleFavorite);

router.get('/:username', getPublicProfile);

export default router;
