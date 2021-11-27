'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Food.belongsTo(models.Category, {foreignKey: 'categoryId'})
      Food.belongsTo(models.User, {foreignKey: 'authorId'})
      Food.hasMany(models.FoodHistory, {foreignKey: 'foodId'})
      Food.hasMany(models.Bookmark, {foreignKey: 'foodId'})
      // Food.belongsToMany(models.User, {through: 'Bookmarks'})
    }
  };
  Food.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: "food name cannot be empty"},
        notNull: {msg: "food name cannot be null"}
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {msg: "food description cannot be empty"},
        notNull: {msg: "food description cannot be null"},
        minLen: function(value) {
          if (value.length < 8) throw new Error('description must be 8 minimum character')
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "food price cannot be null"},
        isNumeric: {msg: "food price must numeric type"}
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {msg: "invalid image url"},
        notEmpty: {msg: "food image cannot be empty"},
        notNull: {msg: "food image cannot be null"}
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {msg: "authorid must numeric type"},
        notNull: {msg: "authorid cannot be null"}
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {msg: "categoryid must numeric type"},
        notNull: {msg: "categoryid cannot be null"}
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        notNull: {msg: 'status cannot be null'},
        notEmpty: {msg: 'status cannot be empty'}
      }
    }
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};