import Joi from 'joi';
import { emailRegexp } from '../constants/authConstants.js';

export const authRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).required(),
});
