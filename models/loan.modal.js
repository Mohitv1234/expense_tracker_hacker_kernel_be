// models/loan.model.js

module.exports = (
  sequelize,
  DataTypes
) => {

  const Loan = sequelize.define(
    'Loan',
    {

      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },

      person_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      loan_type: {

        type: DataTypes.ENUM(
          'borrowed',
          'given'
        ),

        allowNull: false

      },

      total_amount: {

        type: DataTypes.DECIMAL(14, 2),

        allowNull: false

      },

      interest_rate: {

        type: DataTypes.DECIMAL(5, 2),

        defaultValue: 0

      },

      start_date: {

        type: DataTypes.DATEONLY,

        allowNull: false

      },

      due_date: {
        type: DataTypes.DATEONLY
      },

      status: {

        type: DataTypes.ENUM(
          'active',
          'closed',
          'defaulted'
        ),

        defaultValue: 'active'

      },

      notes: {
        type: DataTypes.TEXT
      }

    },

    {

      tableName: 'loans',

      underscored: true,

      timestamps: true

    }
  );

  // =========================
  // ASSOCIATIONS
  // =========================

  Loan.associate = models => {

    // USER

    if (models.User) {

      Loan.belongsTo(
        models.User,
        {
          foreignKey: 'user_id',
          as: 'user'
        }
      );

    }

    // LOAN PAYMENTS

    if (models.LoanPayment) {

      Loan.hasMany(
        models.LoanPayment,
        {
          foreignKey: 'loan_id',
          as: 'payments'
        }
      );

    }

  };

  return Loan;

};