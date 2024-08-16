import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import { emailRegexp } from '../../constants/authConstants.js';

const User = sequelize.define('user', {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail(value) {
        if (!emailRegexp.test(value)) {
          throw new Error('Email not validate');
        }
      },
    },
  },
  avatarURL: {
    type: DataTypes.STRING,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ['starter', 'pro', 'business'],
    defaultValue: 'starter',
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

User.sync();

export default User;
