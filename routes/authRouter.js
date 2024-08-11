import { Router } from 'express';
import authControllers from '../controllers/authControllers.js';
import validateBody from '../decorators/validateBody.js';
import { authRegisterSchema } from '../schemas/authSchema.js';

const registerMiddleware = validateBody(authRegisterSchema);

const authRouter = Router();

authRouter.post('/register', registerMiddleware, authControllers.register);

export default authRouter;
