import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

const create = async (email, password) => {
  const hash = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();
  console.log('Creating user:', { email, hash, createdAt });
  const [resultado] = await pool.execute(
    'INSERT INTO users(email, password, created_at) VALUES(?, ?, ?)',
    [email, hash, createdAt]
  );
  console.log('User created in DB:', resultado);
  return resultado;
};

const where = async (columna, valor) => {
  console.log('Searching user by:', { columna, valor });
  const [resultado] = await pool.execute(`SELECT * FROM users WHERE ${columna}=?`, [valor]);
  console.log('Users found:', resultado);
  return resultado;
};

const findById = async (userId) => {
  console.log('Finding user by ID:', { userId });
  const [resultado] = await pool.execute(
    'SELECT id, email, phone, name, biografia, created_at FROM users WHERE id=?',
    [userId]
  );
  console.log('User found by ID:', resultado);
  return resultado;
};

const updateProfile = async (userId, { photo, name, biografia, phone, email, password }) => {
  console.log('Updating user profile:', { userId, photo, name, biografia, phone, email, password });
  const fields = [];
  const values = [];

  if (photo) {
    fields.push('photo = ?');
    values.push(photo);
  }
  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (biografia) {
    fields.push('biografia = ?');
    values.push(biografia);
  }
  if (phone) {
    fields.push('phone = ?');
    values.push(phone);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    fields.push('password = ?');
    values.push(hash);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(userId);

  const [resultado] = await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  console.log('User profile updated:', resultado);
  return resultado;
};

export default { create, where, findById, updateProfile };
