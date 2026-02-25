import pool from '../db.js';

export const createToken = async (token, id) => {
  const res = await pool.query(
    'INSERT INTO authentications (token, user_id) VALUES ($1, $2) RETURNING *',
    [token, id],
  );
  return res.rows[0];
};

export const verifyToken = async (token) => {
  const res = await pool.query(
    'SELECT * FROM authentications WHERE token = $1',
    [token],
  );
  return res.rows[0];
};

export const deleteToken = async (token) => {
  const res = await pool.query(
    'DELETE FROM authentications WHERE token = $1 RETURNING *',
    [token],
  );
  return res.rows[0];
};

export const deleteTokenByUserId = async (userId) => {
  const res = await pool.query(
    'DELETE FROM authentications WHERE user_id = $1 RETURNING *',
    [userId],
  );
  return res.rows[0];
};
