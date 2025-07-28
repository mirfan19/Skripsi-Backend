// Sequelize model for MonthlyReport
module.exports = (sequelize, DataTypes) => {
  const MonthlyReport = sequelize.define('MonthlyReport', {
    MonthlyIncomeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TotalIncome: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ReportId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'MonthlyReport',
    timestamps: false,
  });

  MonthlyReport.associate = (models) => {
    // Example: MonthlyReport.belongsTo(models.FinancialReport, { foreignKey: 'ReportId', as: 'financialReport' });
  };

  return MonthlyReport;
};
