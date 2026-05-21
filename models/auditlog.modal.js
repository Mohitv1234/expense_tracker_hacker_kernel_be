module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.BIGINT
    },

    action: {
      type: DataTypes.STRING
    },

    module_name: {
      type: DataTypes.STRING
    },

    record_id: {
      type: DataTypes.BIGINT
    },

    old_values: {
      type: DataTypes.JSON
    },

    new_values: {
      type: DataTypes.JSON
    }
  }, {
    tableName: 'audit_logs',
    underscored: true,
    timestamps: true
  });

  return AuditLog;
};