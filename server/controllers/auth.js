import { findByEmail, updateLastLogin } from '../database/models/User.js';
import { verifyPassword, generateToken } from '../utils/auth.js';

export async function login(req, res) {
  const { email, password } = req.body;
  
  const user = await findByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  await updateLastLogin(user.id);

  const token = generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      center: user.center,
      department: user.department,
      avatar: user.avatar
    }
  });
}

export function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}