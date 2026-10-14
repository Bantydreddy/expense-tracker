import { useEffect, useMemo, useState } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Airtime & data', 'Rent', 'School', 'Entertainment', 'Other']
const STORAGE_KEY = 'expense-tracker:v1'

const money = (n) =>
  'KSh ' + n.toLocaleString('en-KE', { maximumFractionDigits: 2 })
const today = () => new Date().toISOString().slice(0, 10)
const shortDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  const [items, setItems] = useState(load)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: CATEGORIES[0],
    date: today(),
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const sum = (type) =>
    items.filter((i) => i.type === type).reduce((total, i) => total + i.amount, 0)
  const income = sum('income')
  const spent = sum('expense')

  const byCategory = useMemo(() => {
    const totals = {}
    items
      .filter((i) => i.type === 'expense')
      .forEach((i) => {
        totals[i.category] = (totals[i.category] || 0) + i.amount
      })
    return Object.entries(totals).sort((a, b) => b[1] - a[1])
  }, [items])

  const visible = items
    .filter((i) => filter === 'all' || i.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  function addItem(e) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.description.trim() || !(amount > 0)) return
    setItems([
      {
        id: Date.now(),
        type: form.type,
        description: form.description.trim(),
        amount,
        category: form.type === 'income' ? 'Income' : form.category,
        date: form.date,
      },
      ...items,
    ])
    setForm({ ...form, description: '', amount: '' })
  }

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id))

  return (
    <div className="page">
      <header>
        <h1>Expense tracker</h1>
      </header>

      <dl className="summary">
        <div className="balance">
          <dt>Balance</dt>
          <dd className={income - spent < 0 ? 'neg' : ''}>{money(income - spent)}</dd>
        </div>
        <div>
          <dt>Money in</dt>
          <dd className="pos">{money(income)}</dd>
        </div>
        <div>
          <dt>Money out</dt>
          <dd className="neg">{money(spent)}</dd>
        </div>
      </dl>

      <div className="layout">
        <aside>
          <form className="panel" onSubmit={addItem}>
            <h2>Add transaction</h2>

            <div className="segmented" role="group" aria-label="Transaction type">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={form.type === t ? 'on' : ''}
                  aria-pressed={form.type === t}
                  onClick={() => setForm({ ...form, type: t })}
                >
                  {t === 'expense' ? 'Expense' : 'Income'}
                </button>
              ))}
            </div>

            <label>
              Description
              <input value={form.description} onChange={update('description')} placeholder="e.g. Lunch at campus" />
            </label>
            <label>
              Amount (KSh)
              <input type="number" min="0" step="0.01" inputMode="decimal" value={form.amount} onChange={update('amount')} />
            </label>
            {form.type === 'expense' && (
              <label>
                Category
                <select value={form.category} onChange={update('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Date
              <input type="date" value={form.date} onChange={update('date')} />
            </label>

            <button className="primary" type="submit">
              {form.type === 'expense' ? 'Add expense' : 'Add income'}
            </button>
          </form>

          {byCategory.length > 0 && (
            <section className="panel">
              <h2>Where it went</h2>
              <ul className="bars">
                {byCategory.map(([name, total]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <span>{money(total)}</span>
                    <i style={{ width: `${(total / spent) * 100}%` }} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <section className="panel list">
          <div className="list-head">
            <h2>Transactions</h2>
            <div className="tabs">
              {[['all', 'All'], ['income', 'Money in'], ['expense', 'Money out']].map(([value, label]) => (
                <button key={value} className={filter === value ? 'on' : ''} onClick={() => setFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="empty">Nothing here yet. Add your first transaction using the form.</p>
          ) : (
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th className="num">Amount</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((i) => (
                    <tr key={i.id}>
                      <td>{shortDate(i.date)}</td>
                      <td>{i.description}</td>
                      <td>{i.category}</td>
                      <td className={'num ' + (i.type === 'income' ? 'pos' : 'neg')}>
                        {i.type === 'income' ? '+' : '-'}
                        {money(i.amount)}
                      </td>
                      <td>
                        <button className="link" onClick={() => removeItem(i.id)} aria-label={`Delete ${i.description}`}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
