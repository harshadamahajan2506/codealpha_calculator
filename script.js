let currentInput = '0';
let previousInput = '';
let operator = null;
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');
const historyList = document.getElementById('history-list');


window.onload = renderHistory;

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    previousDisplay.innerText = operator ? `${previousInput} ${operator}` : '';
}

function appendNumber(num) {
    if (num === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') compute();
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteNumber() {
    currentInput = currentInput.toString().slice(0, -1) || '0';
    updateDisplay();
}

function compute() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = current === 0 ? "Error" : prev / current; break;
        default: return;
    }

    const logEntry = `${previousInput} ${operator} ${currentInput} = ${result}`;
    if (result !== "Error") addToHistory(logEntry);

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}


function toggleHistory() {
    document.getElementById('history-sidebar').classList.toggle('active');
}

function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 20) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">No history yet</p>';
        return;
    }
    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="loadHistory('${item}')">${item}</div>
    `).join('');
}

function clearHistory() {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}

function loadHistory(item) {
    const val = item.split('=')[1].trim();
    currentInput = val;
    updateDisplay();
}


window.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === 'Enter' || e.key === '=') compute();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+') appendOperator('+');
    if (e.key === '-') appendOperator('-');
    if (e.key === '*') appendOperator('×');
    if (e.key === '/') appendOperator('÷');
});
