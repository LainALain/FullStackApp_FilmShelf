import pool from './db.connect.js';

const ddl = [
  `CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(100) NOT NULL UNIQUE,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     description TEXT,
     avatar TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,
  `CREATE TABLE IF NOT EXISTS movies (
     id SERIAL PRIMARY KEY,
     omdb_id VARCHAR(50) NOT NULL UNIQUE,
     title VARCHAR(255) NOT NULL,
     year VARCHAR(10),
     poster_url TEXT,
     genre VARCHAR(255),
     cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,
  `CREATE TABLE IF NOT EXISTS user_movies (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     movie_id INT NOT NULL REFERENCES movies(id) ON DELETE SET NULL,
     added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE (user_id, movie_id)
   );`,
  `CREATE TABLE IF NOT EXISTS comments (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );`,
  `CREATE TABLE IF NOT EXISTS follows (
     follower_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     following_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     PRIMARY KEY (follower_id, following_id)
   );`
];

export default async function initDb() {
  for (const sql of ddl) {
    await pool.query(sql);
  }
  console.log('✅ Tables ensured');
}
