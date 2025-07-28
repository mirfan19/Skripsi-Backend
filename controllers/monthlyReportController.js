const { MonthlyReport } = require('../models');

// GET /monthlyReports
exports.getAllMonthlyReports = async (req, res) => {
  try {
    const reports = await MonthlyReport.findAll({
      order: [['Year', 'ASC'], ['Month', 'ASC']]
    });
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyReports = async (req, res) => {
  try {
    const reports = await MonthlyReport.findAll({
      order: [['Year', 'ASC'], ['Month', 'ASC']]
    });
    let mapped = (reports || [])
      .sort((a, b) =>
        a.Year !== b.Year ? a.Year - b.Year : a.Month - b.Month
      )
      .map((item) => ({
        month: `${item.Year}-${String(item.Month).padStart(2, "0")}`,
        income: item.TotalIncome,
      }));

    // Ambil hanya 2 bulan terakhir
    mapped = mapped.slice(-2);

    res.status(200).json({ data: mapped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
