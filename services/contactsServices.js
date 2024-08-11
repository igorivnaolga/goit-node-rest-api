import Contact from '../db/models/Contact.js';

export const listContacts = (query = {}, { page = 1, limit = 20 }) => {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;

  return Contact.findAll({
    where: query,
    offset,
    limit: normalizedLimit,
  });
};

export const getContact = (query) =>
  Contact.findOne({
    where: query,
  });

// export const getContactById = (id) => Contact.findByPk(id);

export const addContact = (data) => Contact.create(data);

export const updateContact = async (query, data) => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }
  return contact.update(data, {
    returning: true,
  });
};

export const removeContact = async (query) => {
  const contact = await getContact(id);
  Contact.destroy({
    where: {
      query,
    },
  });
  return contact;
};

export const updateStatus = async (id, favorite) => {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }

  return contact.update({ favorite });
};
