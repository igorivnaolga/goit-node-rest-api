import HttpError from '../helpers/HttpError.js';
import * as contactsServices from '../services/contactsServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const getAllContacts = async (_, res) => {
  const result = await contactsServices.listContacts();

  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.getContactById(id);

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.removeContact(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const result = await contactsServices.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: 'Body must have at least one field' });
  }
  const { id } = req.params;
  const result = await contactsServices.updateById(id, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== 'boolean') {
      return res
        .status(400)
        .json({ message: 'Field "favorite" must be boolean' });
    }

    const result = await contactsServices.updateStatusContact(id, { favorite });

    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
