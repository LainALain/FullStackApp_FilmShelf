import db from '../db/db.connect.js';

export async function followUser(req, res) {
  const follower = req.user.userId, following = Number(req.params.targetId);
  try {
    await db.query('INSERT INTO follows (follower_id,following_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [follower, following]);
    res.json({ success: 'Followed' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Follow error' }); }
}
export async function unfollowUser(req, res) {
  const follower = req.user.userId, following = Number(req.params.targetId);
  try {
    await db.query('DELETE FROM follows WHERE follower_id=$1 AND following_id=$2', [follower, following]);
    res.json({ success: 'Unfollowed' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Unfollow error' }); }
}
export async function listFollowers(req, res) {
  const userId = Number(req.params.userId);
  const r = await db.query('SELECT u.id,u.username FROM follows f JOIN users u ON f.follower_id=u.id WHERE f.following_id=$1', [userId]);
  res.json(r.rows);
}
export async function listFollowing(req, res) {
  const userId = Number(req.params.userId);
  const r = await db.query('SELECT u.id,u.username FROM follows f JOIN users u ON f.following_id=u.id WHERE f.follower_id=$1', [userId]);
  res.json(r.rows);
}
