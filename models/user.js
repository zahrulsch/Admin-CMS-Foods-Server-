'use strict';
const {
  Model
} = require('sequelize');
const { hashPasword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Food, {foreignKey: 'authorId'})
      User.hasMany(models.Bookmark, {foreignKey: 'userId'})
      // User.belongsToMany(models.Food, {through: 'Bookmarks'})
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'username cannot be null'},
        notEmpty: {msg: 'username cannot be empty'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'password cannot be null'},
        notEmpty: {msg: 'password cannot be empty'},
        min: {
          args: 5,
          msg: 'password length must be 8 minimun character'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {msg: 'email cannot be null'},
        notEmpty: {msg: 'email cannot be empty'},
        isEmail: {msg: 'invalid email address'}
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'phone cannot be null'},
        notEmpty: {msg: 'phone cannot be empty'}
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'address cannot be empty'},
        notNull: {msg: 'address cannot be null'}
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'role cannot be null'},
        notEmpty: {msg: 'role cannot be empty'}
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPasword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};