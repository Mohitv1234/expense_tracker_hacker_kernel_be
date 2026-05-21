module.exports = (sequelize, DataTypes) => {
  const TransactionTag = sequelize.define('TransactionTag', {
    transaction_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },

    tag_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    }
  }, {
    tableName: 'transaction_tags',
    underscored: true,
    timestamps: false
  });

  return TransactionTag;
};