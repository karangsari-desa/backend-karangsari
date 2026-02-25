import pool from '../db.js';
const users = async () => {
  const query =
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';

  const values = [
    'admin',
    '$2a$12$ZEhQyheYiRO985i2fa5eB.BVFDAFQU8C8OwOehgwL82bizPC0HRpm',
  ];
  const res = await pool.query(query, values);
  if (res.rows.length > 0) {
    console.log('User created successfully');
  } else {
    console.log('Failed to create user');
  }
};

users();
