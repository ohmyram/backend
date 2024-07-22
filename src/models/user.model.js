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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, photo, biografia, phone, email, password } = req.body;
    console.log('UpdateProfile function called with userId:', userId); // Log userId
    console.log('UpdateProfile function called with data:', { name, photo, biografia, phone, email, password }); // Log data

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    const result = await db.updateProfile(userId, name, photo, biografia, phone, email, password);
    console.log('Profile updated:', result); // Log result
    res.json({ message: 'Profile updated successfully', result });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export default { create, where, findById, updateProfile };
