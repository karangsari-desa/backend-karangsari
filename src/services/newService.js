import pool from '../db.js';

export const getAllNews = async () => {
  const res = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
  return res.rows;
};

export const getNewsById = async (id) => {
  const res = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
  return res.rows[0];
};

export const createNews = async (user_id, img, title, body) => {
  const res = await pool.query(
    'INSERT INTO news (user_id, img, title, body) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, img, title, body],
  );
  return res.rows[0];
};

export const updateNews = async (id, user_id, img, title, body) => {
  const res = await pool.query(
    'UPDATE news SET user_id = $1, img = $2, title = $3, body = $4, updated_at = current_timestamp WHERE id = $5 RETURNING *',
    [user_id, img, title, body, id],
  );
  return res.rows[0];
};

export const deleteNews = async (id) => {
  const res = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [
    id,
  ]);
  return res.rows[0];
};

export default {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
