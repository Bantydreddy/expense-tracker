import { useState } from 'react'
import './App.css'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ConfirmDialog from './components/ConfirmDialog'
import MonthlySummary from './components/MonthlySummary'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [pendingDelete, setPendingDelete] = useState(null);

  const handleAdd = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteRequest = (transaction) => {
    setPendingDelete(transaction);
  };

  const handleDeleteConfirm = () => {
    setTransactions(prev => prev.filter(t => t.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const handleDeleteCancel = () => {
    setPendingDelete(null);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Finance <span>Grove</span></h1>
        <p>Track your income and expenses</p>
      </div>

      <Summary transactions={transactions} />
      <MonthlySummary transactions={transactions} />
      <TransactionForm onAdd={handleAdd} />
      <TransactionList transactions={transactions} onDeleteRequest={handleDeleteRequest} />

      {pendingDelete && (
        <ConfirmDialog
          transaction={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

export default App;