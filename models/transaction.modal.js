module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    account_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    transaction_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    category_id: {
      type: DataTypes.BIGINT
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    reference_no: {
      type: DataTypes.STRING
    },

    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    payment_method: {
      type: DataTypes.ENUM(
        'cash',
        'bank',
        'upi',
        'card',
        'wallet'
      )
    },

    status: {
      type: DataTypes.ENUM(
        'pending',
        'completed',
        'cancelled'
      ),
      defaultValue: 'completed'
    }
  }, {
    tableName: 'transactions',
    underscored: true,
    timestamps: true
  });

  Transaction.associate = models => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Transaction.belongsTo(models.Account, {
      foreignKey: 'account_id'
    });

    Transaction.belongsTo(models.TransactionType, {
      foreignKey: 'transaction_type_id'
    });

    Transaction.belongsTo(models.Category, {
      foreignKey: 'category_id'
    });

    Transaction.hasMany(models.Attachment, {
      foreignKey: 'transaction_id'
    });

    Transaction.belongsToMany(models.Tag, {
      through: models.TransactionTag,
      foreignKey: 'transaction_id'
    });
  };

  return Transaction;
};