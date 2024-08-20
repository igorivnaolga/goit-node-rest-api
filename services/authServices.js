import bcrypt from 'bcrypt';

import User from '../db/models/User.js';

import gravatar from 'gravatar';

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const updateUser = async (query, data) => {
  const user = await findUser(query);
  console.log('Found user:', user);
  if (!user) {
    return null;
  }
  console.log('Data before update:', data);
  return user.update(data, {
    returning: true,
  });
};

export const register = async (data) => {
  try {
    const { password, email } = data;
    const avatarURL = gravatar.url(email);
    console.log('Generated avatarURL:', avatarURL);
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...data,
      avatarURL,
      password: hashPassword,
    });
    return newUser;
  } catch (error) {
    if (error?.parent?.code === '23505') {
      error.message = 'Email in use';
    }
    throw error;
  }
};
