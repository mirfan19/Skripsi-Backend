'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // detect actual table names (singular/plural)
    const all = await queryInterface.showAllTables();
    const tableList = all.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const financialTable = tableList.find(n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report'));
    const summaryTable = tableList.find(n => n && n.toLowerCase().includes('transaction') && n.toLowerCase().includes('summary'));

    if (!financialTable) {
      console.warn('Skipping seeder: FinancialReport table not found.');
      return;
    }

    // describe financial table columns
    const finCols = await queryInterface.describeTable(financialTable).catch(() => null);
    if (!finCols) {
      console.warn(`Skipping: unable to describe ${financialTable}`);
      return;
    }
    const colNames = Object.keys(finCols).map(c => c.toLowerCase());
    const has = (name) => colNames.includes(name.toLowerCase());

    const now = new Date();
    const finRows = [];

    // Prefer schema with income/expenses/gross_revenue/net_revenue + date
    if (has('income') && has('expenses') && has('gross_revenue') && has('net_revenue')) {
      finRows.push({
        income: 1000000.00,
        expenses: 400000.00,
        gross_revenue: 600000.00,
        net_revenue: 500000.00,
        date: '2025-07-01'
      }, {
        income: 2000000.00,
        expenses: 800000.00,
        gross_revenue: 1200000.00,
        net_revenue: 1000000.00,
        date: '2025-06-01'
      });
    }
    // Else prefer monthly-report style (Month, Year, TotalIncome)
    else if (has('month') && has('year') && has('totalincome')) {
      finRows.push({
        Month: 7,
        Year: 2025,
        TotalIncome: 10000000,
        date: '2025-07-01'
      }, {
        Month: 6,
        Year: 2025,
        TotalIncome: 8000000,
        date: '2025-06-01'
      });
    }
    // Fallback: try date + some totals if available
    else if (has('date') && (has('totalincome') || has('income') || has('gross_revenue'))) {
      const totalKey = has('totalincome') ? 'TotalIncome' : has('income') ? 'income' : 'gross_revenue';
      finRows.push({
        [totalKey]: 1000000.00,
        date: '2025-07-01'
      }, {
        [totalKey]: 800000.00,
        date: '2025-06-01'
      });
    } else {
      console.warn(`FinancialReport table ${financialTable} has unexpected schema, skipping inserts.`);
      return;
    }

    // add timestamps if table has them
    const needsTimestamps = !!(has('createdat') || has('updatedat'));
    if (needsTimestamps) {
      finRows.forEach(r => { r.createdAt = now; r.updatedAt = now; });
    }

    // insert into financial table
    await queryInterface.bulkInsert(financialTable, finRows, {});

    // seed TransactionSummary if present
    if (!summaryTable) {
      console.info('TransactionSummary table not found — skipping TransactionSummary seed.');
      return;
    }

    // fetch ReportIDs we just inserted when available
    let reportIds = [];
    if (has('date')) {
      const dates = finRows.map(r => r.date).filter(Boolean);
      if (dates.length) {
        const replacements = dates.map((_, i) => `$${i + 1}`).join(',');
        const sql = `SELECT * FROM "${financialTable}" WHERE "date" IN (${replacements})`;
        const reports = await queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          bind: dates
        }).catch(() => []);
        reportIds = reports.map(r => r.ReportID || r.reportid || r.id).filter(Boolean);
      }
    } else if (has('totalincome')) {
      // best-effort fetch by TotalIncome values we inserted
      const totals = finRows.map(r => r.TotalIncome).filter(Boolean);
      if (totals.length) {
        const replacements = totals.map((_, i) => `$${i + 1}`).join(',');
        const sql = `SELECT * FROM "${financialTable}" WHERE "TotalIncome" IN (${replacements})`;
        const reports = await queryInterface.sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT,
          bind: totals
        }).catch(() => []);
        reportIds = reports.map(r => r.ReportID || r.reportid || r.id).filter(Boolean);
      }
    }

    // describe summary table and prepare rows using only existing columns
    const sumCols = await queryInterface.describeTable(summaryTable).catch(() => null);
    if (!sumCols) {
      console.warn(`Skipping summary seed: unable to describe ${summaryTable}`);
      return;
    }
    const sumColNames = Object.keys(sumCols).map(c => c.toLowerCase());
    const sumHas = (n) => sumColNames.includes(n.toLowerCase());
    const sumNeedsTimestamps = !!(sumHas('createdat') || sumHas('updatedat'));

    const summaryRows = [];
    // create a few summary rows referencing available ReportIDs (or null if none)
    for (let i = 0; i < 3; i++) {
      const row = {};
      if (sumHas('paymentid')) row.PaymentID = null;
      if (sumHas('reportid')) row.ReportID = reportIds[i] || reportIds[0] || null;
      if (sumHas('transactiondate')) row.TransactionDate = new Date(`2025-07-${10 + i}`);
      // amount could be named Amount or amount
      if (sumHas('amount')) row.Amount = [5000000, 5000000, 8000000][i % 3];
      if (sumHas('transactiontype')) row.TransactionType = i === 2 ? 'Income' : 'Income';
      if (sumNeedsTimestamps) { row.createdAt = now; row.updatedAt = now; }
      summaryRows.push(row);
    }

    // if summaryRows have at least one key, insert
    if (summaryRows.length && Object.keys(summaryRows[0]).length > 0) {
      await queryInterface.bulkInsert(summaryTable, summaryRows, {});
    } else {
      console.info('No compatible columns found on TransactionSummary — skipping insert.');
    }
  },

  down: async (queryInterface /* Sequelize */) => {
    // detect actual table names again
    const all = await queryInterface.showAllTables();
    const tableList = all.map(t => (typeof t === 'object' ? (t.tableName || t.name || '') : String(t)));
    const financialTable = tableList.find(n => n && n.toLowerCase().includes('financial') && n.toLowerCase().includes('report'));
    const summaryTable = tableList.find(n => n && n.toLowerCase().includes('transaction') && n.toLowerCase().includes('summary'));

    if (summaryTable) {
      await queryInterface.bulkDelete(summaryTable, {
        // best-effort: remove by amounts used above
        Amount: { [require('sequelize').Op.in]: [5000000, 8000000] }
      }, {});
    }

    if (financialTable) {
      await queryInterface.bulkDelete(financialTable, {
        date: { [require('sequelize').Op.in]: ['2025-07-01','2025-06-01'] }
      }, {});
    }
  }
};
