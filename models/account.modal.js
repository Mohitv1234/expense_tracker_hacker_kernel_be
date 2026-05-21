module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    account_type: {
      type: DataTypes.ENUM(
        'cash',
        'bank',
        'upi',
        'credit_card',
        'wallet'
      ),
      allowNull: false
    },

    balance: {
      type: DataTypes.DECIMAL(14, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'accounts',
    underscored: true,
    timestamps: true
  });

  Account.associate = models => {
    Account.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Account.hasMany(models.Transaction, {
      foreignKey: 'account_id'
    });
  };

  return Account;
};