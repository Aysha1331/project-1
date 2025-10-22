const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const ctx = document.getElementById('chart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;

// Update chart
function updateChart() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    }
  });
}

// Render list
function renderList() {
  list.innerHTML = '';
  transactions.forEach((t, i) => {
    const li = document.createElement('li');
    li.classList.add(t.type === 'income' ? 'income-item' : 'expense-item');
    li.innerHTML = `
      ${t.text}: ₹${t.amount}
      <button onclick="deleteItem(${i})">❌</button>
    `;
    list.appendChild(li);
  });

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = balance;
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateChart();
}

// Add new item
addBtn.onclick = () => {
  if (text.value.trim() === '' || amount.value === '') return alert('Fill all fields!');
  transactions.push({
    text: text.value,
    amount: +amount.value,
    type: type.value
  });
  text.value = '';
  amount.value = '';
  renderList();
};

// Delete item
function deleteItem(i) {
  transactions.splice(i, 1);
  renderList();
}

// Initial render
renderList();
