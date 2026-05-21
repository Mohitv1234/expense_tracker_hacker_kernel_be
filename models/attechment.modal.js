module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    transaction_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    },

    file_type: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'attachments',
    underscored: true,
    timestamps: true
  });

  Attachment.associate = models => {
    Attachment.belongsTo(models.Transaction, {
      foreignKey: 'transaction_id'
    });
  };

  return Attachment;
};