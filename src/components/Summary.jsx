
function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary">
      <div className="summary-card">
        <span className="card-icon">🌿</span>
        <h3>Total Income</h3>
        <p className="income-amount">${totalIncome.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <span className="card-icon">🍂</span>
        <h3>Total Expenses</h3>
        <p className="expense-amount">${totalExpenses.toLocaleString()}</p>
      </div>
      <div className="summary-card">
        <span className="card-icon">🌰</span>
        <h3>Balance</h3>
        <p className="balance-amount">${balance.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Summary;