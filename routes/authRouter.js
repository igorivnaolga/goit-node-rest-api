import { Router } from 'express';
import authControllers from '../controllers/authControllers.js';
import validateBody from '../decorators/validateBody.js';
import { authRegisterSchema } from '../schemas/authSchema.js';
import authenticate from '../middlewares/authenticate.js';

const registerMiddleware = validateBody(authRegisterSchema);

const authRouter = Router();

authRouter.post('/register', registerMiddleware, authControllers.register);

authRouter.post('/login', registerMiddleware, authControllers.login);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.get('/current', authenticate, authControllers.getCurrent);

export default authRouter;
