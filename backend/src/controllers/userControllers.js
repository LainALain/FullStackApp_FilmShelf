import db from '../db/db.connect.js';

export async function getPublicProfile(req, res) {
  const { username } = req.params;
  try {
    const u = await db.query('SELECT username,email,description,avatar,created_at FROM users WHERE username=$1', [username]);
    if (!u.rows.length) return res.status(404).json({ error: 'Пользователь не найден' });
    const user = u.rows[0];
    const m = await db.query(
    `SELECT m.omdb_id   AS "imdbID", m.title     AS "Title", m.poster_url AS "Poster", m.year      AS "Year" FROM user_movies um
    JOIN movies m ON um.movie_id = m.id WHERE um.user_id = (SELECT id FROM users WHERE username = $1)
    ORDER BY um.added_at`, [username]);

    res.json({ user, movies: m.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Profile error' }); }
}
export async function toggleFavorite(req, res) {
  const userID = req.user?.userId;
  const { omdbId } = req.body;

  if (!userID) {
    return res.status(401).json({ error: 'Вы не авторизованы' });
  }
  if (!omdbId) {
    return res.status(400).json({ error: 'omdbId не передан' });
  }

  try {
    let movieRow = await db.query('SELECT id FROM movies WHERE omdb_id=$1', [omdbId]);
    let movieId;

    if (movieRow.rows.length === 0) {
      const response = await fetch(`${process.env.OMDB_API}&i=${encodeURIComponent(omdbId)}`);
      const data = await response.json();

      if (data.Response === 'False') {
        return res.status(404).json({ error: 'Фильм не найден' });
      }

      const { Title, Year, Poster, Genre } = data;

      const insertRes = await db.query(
        'INSERT INTO movies (omdb_id, title, year, poster_url, genre) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [omdbId, Title, Year, Poster, Genre]
      );
      movieId = insertRes.rows[0].id;
    } else {
      movieId = movieRow.rows[0].id;
    }

    const check = await db.query(
      'SELECT 1 FROM user_movies WHERE user_id=$1 AND movie_id=$2',
      [userID, movieId]
    );

    if (check.rowCount > 0) {
      await db.query('DELETE FROM user_movies WHERE user_id=$1 AND movie_id=$2', [userID, movieId]);
      return res.status(200).json({ message: 'Удалено из избранного' });
    } else {
      await db.query('INSERT INTO user_movies (user_id, movie_id) VALUES ($1, $2)', [userID, movieId]);
      return res.status(200).json({ message: 'Добавлено в избранное' });
    }
  } catch (e) {
    console.error('toggleFavorite error:', e);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}

export async function getMySettings(req, res) {
  const userId = req.user.userId;
  try {
    const r = await db.query('SELECT username,email,description,avatar,created_at FROM users WHERE id=$1', [userId]);
    if (!r.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Settings error' }); }
}
export async function updateMySettings(req, res) {
  const userId = req.user.userId;
  const { username, email, description, avatar } = req.body;
  try {
    await db.query('UPDATE users SET username=COALESCE($1,username),email=COALESCE($2,email),description=COALESCE($3,description),avatar=COALESCE($4,avatar) WHERE id=$5',
      [username, email, description, avatar, userId]);
    res.json({ success: 'Настройки сохранены' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Update error' }); }
}
export async function deleteMyAccount(req, res) {
  const userId = req.user.userId;
  try {
    await db.query('DELETE FROM users WHERE id=$1', [userId]);
    res.json({ success: 'Аккаунт удалён' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Delete error' }); }
}
