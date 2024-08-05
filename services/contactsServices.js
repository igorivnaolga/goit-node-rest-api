import User from '../db/models/User.js';

export const listContacts = () => User.findAll();

export const getContactById = (id) => User.findByPk(id);

export const addContact = (data) => User.create(data);

export const updateById = async (id, data) =>
  User.update(data, {
    where: {
      id,
    },
  });

export const removeContact = async (id) =>
  User.destroy({
    where: {
      id,
    },
  });

export const updateStatusContact = async (id, favorite) => {
  const [numberOfAffectedRows, [updatedContact]] = await User.update(
    { favorite },
    {
      where: { id },
      returning: true,
      plain: true,
    }
  );

  if (numberOfAffectedRows === 0) {
    return null;
  }

  return updatedContact;
};
