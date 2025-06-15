import db from '../db/db.connect.js';

export async function getComments(req, res) {
  const { omdbId } = req.params;
  try {
    const result = await db.query('SELECT c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id=u.id WHERE c.movie_id=(SELECT id FROM movies WHERE omdb_id=$1) ORDER BY c.created_at', [omdbId]);
    res.json(result.rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Get comments error' }); }
}
export async function addComment(req, res) {
  const { omdbId } = req.params;
  const { content } = req.body;
  try {
    let movie = await db.query('SELECT id FROM movies WHERE omdb_id=$1', [omdbId]);
    let movieId;
    if (movie.rows.length) movieId = movie.rows[0].id;
    else {
      const m = await fetch(`${process.env.OMDB_API}&i=${omdbId}`).then(r => r.json());
      const r = await db.query('INSERT INTO movies (omdb_id,title,year,poster_url,genre) VALUES($1,$2,$3,$4,$5) RETURNING id', [omdbId, m.Title, m.Year, m.Poster, m.Genre]);
      movieId = r.rows[0].id;
    }
    await db.query('INSERT INTO comments (user_id,movie_id,content) VALUES($1,$2,$3)', [req.user.userId, movieId, content]);
    res.status(201).json({ success: 'Comment added' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Add comment error' }); }
}
