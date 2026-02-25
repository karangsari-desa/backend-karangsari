import pool from '../db.js';
import bcrypt from 'bcrypt';

export const verifyUserCredentials = async (username, password) => {
  const isValidUSername = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username],
  );
  const user = isValidUSername.rows[0];
  if (!user) {
    return null;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }
  return user;
};

export const createUser = async (username, password) => {
  const isValidUSername = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username],
  );
  if (isValidUSername.rows.length > 0) {
    return null;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword],
  );
  return newUser.rows[0];
};

export const changePassword = async (
  username,
  oldPassword,
  newPassword,
  confirmPassword,
) => {
  const isValidUSername = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username],
  );

  const user = isValidUSername.rows[0];
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    return null;
  }

  if (newPassword !== confirmPassword) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE users SET password = $1 WHERE username = $2', [
    hashedPassword,
    username,
  ]);

  return true;
};
