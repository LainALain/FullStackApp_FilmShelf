import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { followUser, unfollowUser, listFollowers, listFollowing } from '../controllers/socialControllers.js';

const router = Router();

router.post('/:targetId/follow', auth, followUser);
router.delete('/:targetId/unfollow', auth, unfollowUser);
router.get('/:userId/followers', listFollowers);
router.get('/:userId/following', listFollowing);

export default router;
