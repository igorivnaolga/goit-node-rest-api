import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';
import { token } from 'morgan';
import { listContacts } from '../services/contactsServices.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';

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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
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
  const { email, subscription } = req.user;
  res.json({
    email: email,
    subscription: subscription,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File not provided' });
  }

  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);
  const { id } = req.user;
  console.log('Filename:', filename);
  const avatarURL = path.join('avatars', filename);
  console.log('Generated avatarURL:', avatarURL);
  const data = {
    avatarURL,
  };
  const query = { id };
  const updatedUser = await authServices.updateUser(query, data);
  console.log('Updated avatarURL:', updatedUser.avatarURL);
  res.json({ avatarURL: updatedUser.avatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout,
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
