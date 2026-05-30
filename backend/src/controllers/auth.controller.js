import User from '../models/User.js';
import { signToken } from '../utils/token.js';

function authPayload(user) {
  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, interests: user.interests }
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, interests = [] } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email and password are required');
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error('Email already registered');
    }

    const user = await User.create({ name, email, password, interests });
    res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
}
