module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define('Budget', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'budgets',
    underscored: true,
    timestamps: true
  });

  Budget.associate = models => {
    Budget.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Budget.belongsTo(models.Category, {
      foreignKey: 'category_id'
    });
  };

  return Budget;
};