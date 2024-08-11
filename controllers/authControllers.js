import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';

const register = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    email: newUser.email,
  });
};

export default {
  register: ctrlWrapper(register),
};
