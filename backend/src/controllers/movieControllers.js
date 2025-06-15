import fetch from 'node-fetch';
import db from '../db/db.connect.js';

export async function searchMovies(req, res) {

  const { title } = req.query;

  if (!title) return res.status(400).json({ error: 'No title' });
  try {
    const omdb = await fetch(`${process.env.OMDB_API}&s=${encodeURIComponent(title)}`);
    const data = await omdb.json();
    if (data.Response === 'False') return res.status(404).json({ error: data.Error });
    res.json(data.Search);
  } catch (e) { console.error(e); res.status(500).json({ error: 'OMDB error' }); }
}
export async function getMovieDetails(req, res) {
  const { omdbId } = req.params;
  try {
    const omdb = await fetch(`${process.env.OMDB_API}&i=${omdbId}`);
    const data = await omdb.json();
    if (data.Response === 'False') return res.status(404).json({ error: data.Error });
    res.json(data);
  } catch (e) { console.error(e); res.status(500).json({ error: 'OMDB error' }); }
}
