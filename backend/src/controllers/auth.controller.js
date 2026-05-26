import User from '../models/User.js';
import { signToken } from '../utils/token.js';

function authPayload(user) {
  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, interests: user.interests }
  };
}

export async function register(req, res) {
  const { name, email, password, interests = [] } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, interests });
  res.status(201).json(authPayload(user));
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json(authPayload(user));
}
