import { Router } from 'express';
import authControllers from '../controllers/authControllers.js';
import validateBody from '../decorators/validateBody.js';
import { authRegisterSchema, authEmailSchema } from '../schemas/authSchema.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const registerMiddleware = validateBody(authRegisterSchema);
const verifyEmailMiddleware = validateBody(authEmailSchema);

const authRouter = Router();

authRouter.post('/register', registerMiddleware, authControllers.register);

authRouter.get('/verify/:verificationToken', authControllers.verify);

authRouter.post('/verify', verifyEmailMiddleware, authControllers.resendVerify);

authRouter.post('/login', registerMiddleware, authControllers.login);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.patch(
  '/avatars',
  upload.single('avatar'),
  authenticate,
  authControllers.updateAvatar
);

export default authRouter;
