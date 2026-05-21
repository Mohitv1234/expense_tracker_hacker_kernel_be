module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
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
    }
  }, {
    tableName: 'tags',
    underscored: true,
    timestamps: true
  });

  Tag.associate = models => {
    Tag.belongsTo(models.User, {
      foreignKey: 'user_id'
    });

    Tag.belongsToMany(models.Transaction, {
      through: models.TransactionTag,
      foreignKey: 'tag_id'
    });
  };

  return Tag;
};
