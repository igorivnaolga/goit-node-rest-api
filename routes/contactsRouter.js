import express from 'express';
import contactsControllers from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get('/', contactsControllers.getAllContacts);

contactsRouter.get('/:id', contactsControllers.getOneContact);

// contactsRouter.delete('/:id', deleteContact);

// contactsRouter.post('/', createContact);

// contactsRouter.put('/:id', updateContact);

export default contactsRouter;
