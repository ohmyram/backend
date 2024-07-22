import db from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET_KEY } from '../config/config.js';

export const register = async (req, res) => {
  const { email, password } = req.body;
  console.log('Register function called', { email, password });

  try {
    const user = await db.create(email, password);
    console.log('User created:', user);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login function called', { email, password });

  try {
    const users = await db.where('email', email);
    console.log('Users found:', users);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const me = async (req, res) => {
  const userId = req.user.id;
  console.log('Me function called', { userId });

  try {
    const users = await db.findById(userId);
    console.log('User found:', users);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { nombres, apellidos, telefono, username } = req.body;
  console.log('UpdateProfile function called', { userId, nombres, apellidos, telefono, username });

  try {
    const result = await db.updateProfile(userId, nombres, apellidos, telefono, username);
    console.log('Profile updated:', result);
    res.json({ message: 'Profile updated successfully', result });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
