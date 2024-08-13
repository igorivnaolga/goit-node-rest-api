import express from 'express';
import contactsControllers from '../controllers/contactsControllers.js';
import validateBody from '../decorators/validateBody.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import authenticate from '../middlewares/authenticate.js';

const createContactMiddleware = validateBody(createContactSchema);
const updateContactMiddleware = validateBody(updateContactSchema);

const contactsRouter = express.Router();

// contactsRouter.use(authenticate);

contactsRouter.get('/', contactsControllers.getAllContacts);

contactsRouter.get('/:id', contactsControllers.getOneContact);

contactsRouter.delete('/:id', contactsControllers.deleteContact);

contactsRouter.post(
  '/',
  createContactMiddleware,
  contactsControllers.createContact
);

contactsRouter.put(
  '/:id',
  updateContactMiddleware,
  contactsControllers.updateContactById
);

contactsRouter.patch(
  '/:id/favorite',
  updateContactMiddleware,
  contactsControllers.updateStatusContact
);

export default contactsRouter;
