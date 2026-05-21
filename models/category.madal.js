module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    transaction_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    icon: {
      type: DataTypes.STRING
    },

    color: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'categories',
    underscored: true,
    timestamps: true
  });

  Category.associate = models => {
    Category.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Category.belongsTo(models.TransactionType, {
      foreignKey: 'transaction_type_id'
    });

    Category.hasMany(models.Transaction, {
      foreignKey: 'category_id'
    });
  };

  return Category;
};