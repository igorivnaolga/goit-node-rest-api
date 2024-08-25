import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';
import { token } from 'morgan';
import { listContacts } from '../services/contactsServices.js';
import path from 'node:path';

const avatarsPath = path.resolve('public', 'avatars');

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: 'starter',
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await authServices.updateUser(
    { verificationToken },
    {
      verify: true,
      verificationToken: null,
    }
  );

  res.json({
    message: 'Verification successful',
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  await authServices.sendVerifyEmail(user.email, user.verificationToken);

  res.json({
    message: 'Verification email sent',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const { id } = user;
  const contacts = await listContacts({ owner: id });

  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  await authServices.updateUser({ id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const logout = async (req, res) => {
  const { id } = req.user;
  await authServices.updateUser({ id }, { token: '' });
  res.status(204).send();
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.json({
    email: email,
    subscription: subscription,
    avatarURL: avatarURL,
  });
};

const updateAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await await fs.rename(oldPath, newPath);
  const { id } = req.user;

  const avatarURL = path.join('public', 'avatars', filename);
  await User.update({ avatarURL }, { where: { id } });

  res.json({ avatarURL });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  logout,
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
