import Contact from '../db/models/Contact.js';

export const listContacts = () => Contact.findAll();

export const getContactById = (id) => Contact.findByPk(id);

export const addContact = (data) => Contact.create(data);

export const updateById = async (id, data) => {
  const contact = await getContactById(id);
  if (!contact) {
    return null;
  }
  return contact.update(data, {
    returning: true,
  });
};

export const removeContact = async (id) => {
  const contact = await getContactById(id);
  Contact.destroy({
    where: {
      id,
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
