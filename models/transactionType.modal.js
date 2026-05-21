module.exports = (sequelize, DataTypes) => {
  const TransactionType = sequelize.define('TransactionType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'transaction_types',
    underscored: true,
    timestamps: true
  });

  TransactionType.associate = models => {
    TransactionType.hasMany(models.Transaction, {
      foreignKey: 'transaction_type_id'
    });

    TransactionType.hasMany(models.Category, {
      foreignKey: 'transaction_type_id'
    });
  };

  return TransactionType;
};