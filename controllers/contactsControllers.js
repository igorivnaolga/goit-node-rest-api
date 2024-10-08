import HttpError from '../helpers/HttpError.js';
import * as contactsServices from '../services/contactsServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import path from 'node:path';
import * as fs from 'node:fs/promises';

const avatarsPath = path.resolve('public', 'avatars');

const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const result = await contactsServices.listContacts(
    { owner },
    { page, limit }
  );

  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await contactsServices.getContact({ id, owner });

  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const result = await contactsServices.removeContact({ id, owner });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const createContact = async (req, res) => {
  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(avatarsPath, filename);
  // await fs.rename(oldPath, newPath);
  // const { id: owner } = req.user;
  // const avatar = path.join('public', 'avatars', filename);
  const result = await contactsServices.addContact({
    ...req.body,
    owner,
  });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: 'Body must have at least one field' });
  }
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await contactsServices.updateContact({ id, owner }, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== 'boolean') {
    return res
      .status(400)
      .json({ message: 'Field "favorite" must be boolean' });
  }
  const result = await contactsServices.updateStatus(id, favorite);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContactById: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
