import { useState } from 'react';

function MonthlySummary({ transactions }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthlyTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const categoryBreakdown = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="panel">
      <h2><span className="panel-icon">📊</span> Monthly Summary</h2>

      <div className="month-selector">
        <button onClick={handlePrevMonth} className="btn-nav">← Prev</button>
        <span className="month-display">{monthName}</span>
        <button onClick={handleNextMonth} className="btn-nav">Next →</button>
      </div>

      <div className="monthly-cards">
        <div className="monthly-card">
          <h4>Income</h4>
          <p className="income-amount">${monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="monthly-card">
          <h4>Expenses</h4>
          <p className="expense-amount">${monthlyExpenses.toLocaleString()}</p>
        </div>
        <div className="monthly-card">
          <h4>Balance</h4>
          <p className={monthlyBalance >= 0 ? "income-amount" : "expense-amount"}>
            ${monthlyBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="category-breakdown">
          <h3>Expenses by Category</h3>
          <div className="category-list">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">${amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {Object.keys(categoryBreakdown).length === 0 && monthlyTransactions.length === 0 && (
        <p className="empty-state">🌿 No transactions for this month</p>
      )}
    </div>
  );
}

export default MonthlySummary;
