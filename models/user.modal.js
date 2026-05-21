// models/user.model.js

module.exports = (
  sequelize,
  DataTypes
) => {

  const User = sequelize.define(
    'User',
    {

      id: {

        type: DataTypes.BIGINT,

        primaryKey: true,

        autoIncrement: true,

        allowNull: false

      },

      name: {

        type: DataTypes.STRING,

        allowNull: false

      },

      email: {

        type: DataTypes.STRING,

        allowNull: false,

        unique: true

      },

      password: {

        type: DataTypes.STRING,

        allowNull: false

      },

      phone: {
        type: DataTypes.STRING
      },

      status: {

        type: DataTypes.ENUM(
          'active',
          'inactive',
          'blocked'
        ),

        defaultValue: 'active'

      }

    },

    {

      tableName: 'users',

      underscored: true,

      timestamps: true

    }
  );

  // =========================
  // ASSOCIATIONS
  // =========================

  User.associate = models => {

    // ACCOUNT

    if (models.Account) {

      User.hasMany(
        models.Account,
        {
          foreignKey: 'user_id',
          as: 'accounts'
        }
      );

    }

    // TRANSACTION

    if (models.Transaction) {

      User.hasMany(
        models.Transaction,
        {
          foreignKey: 'user_id',
          as: 'transactions'
        }
      );

    }

    // CATEGORY

    if (models.Category) {

      User.hasMany(
        models.Category,
        {
          foreignKey: 'user_id',
          as: 'categories'
        }
      );

    }

    // LOAN

    if (models.Loan) {

      User.hasMany(
        models.Loan,
        {
          foreignKey: 'user_id',
          as: 'loans'
        }
      );

    }

    // BUDGET

    if (models.Budget) {

      User.hasMany(
        models.Budget,
        {
          foreignKey: 'user_id',
          as: 'budgets'
        }
      );

    }

    // TAG

    if (models.Tag) {

      User.hasMany(
        models.Tag,
        {
          foreignKey: 'user_id',
          as: 'tags'
        }
      );

    }

  };

  return User;

};