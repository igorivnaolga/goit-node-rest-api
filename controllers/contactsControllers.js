import * as contactsServices from '../services/contactsServices.js';

const getAllContacts = async (req, res) => {
  try {
    const result = await contactsServices.listContacts();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);

    if (!result) {
      const error = new Error(`Movie with id=${id} not found`);
      error.status = 404;
      throw error;
    }
    res.json(result);
  } catch (error) {
    const { status = 500, message } = error;
    res.status(status).json({
      message,
    });
  }
};

// const deleteContact = (req, res) => {};

// const createContact = (req, res) => {};

// const updateContact = (req, res) => {};

export default {
  getAllContacts,
  getOneContact,
  //   deleteContact,
  //   createContact,
  //   updateContact,
};
