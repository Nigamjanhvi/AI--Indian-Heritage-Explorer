import crypto from 'crypto';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { createToken } from '../services/jwtService.js';

function userPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    interests: user.interests,
    savedPlaces: user.savedPlaces,
    role: user.role
  };
}

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture = '', interests = [] } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

  const user = await User.create({ name, email, password, profilePicture, interests });
  res.status(201).json({ success: true, token: createToken(user), user: userPayload(user) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({ success: true, token: createToken(user), user: userPayload(user) });
});

export const getProfile = asyncHandler(async (req, res) => {
  await req.user.populate('savedPlaces');
  res.json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'profilePicture', 'interests'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ success: true, user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ success: false, message: 'No user found with that email' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Password reset token generated. Connect email service to send it in production.',
    resetToken
  });
});
