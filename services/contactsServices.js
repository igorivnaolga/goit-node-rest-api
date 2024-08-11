import User from '../db/models/User.js';

export const listContacts = () => User.findAll();

export const getContactById = (id) => User.findByPk(id);

export const addContact = (data) => User.create(data);

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
  User.destroy({
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
