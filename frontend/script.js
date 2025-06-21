let balance = 0;
let spent = 0;
const creditHistory = [];
const debitHistory = [];

function login() {
  const name = document.getElementById("nameBox").value;
  if (name.trim() !== "") {
    document.getElementById("usernameDisplay").innerText = name;
    document.getElementById("appArea").style.display = "block";
    document.getElementById("loginpage").style.display = "none";
  }
}

function creditbtn() {
  const creditDiv = document.getElementById("creditbtn");
  const debitDiv = document.getElementById("debitbtn");
  creditDiv.style.display =
    creditDiv.style.display === "block" ? "none" : "block";
  debitDiv.style.display = "none";
}

function debitbtn() {
  const creditDiv = document.getElementById("creditbtn");
  const debitDiv = document.getElementById("debitbtn");
  debitDiv.style.display =
    debitDiv.style.display === "block" ? "none" : "block";
  creditDiv.style.display = "none";
}

function addMoney() {
  const date = document.getElementById("cashIndate").value;
  const reason = document.getElementById("cashInReason").value;
  const amount = Number(document.getElementById("cashInAmount").value);

  if (date && reason && amount > 0) {
    balance += amount;
    document.getElementById("balance").innerText = balance;
    creditHistory.push({ date, reason, amount });
    document.getElementById("cashIndate").value = "";
    document.getElementById("cashInReason").value = "";
    document.getElementById("cashInAmount").value = "";
    document.getElementById("creditbtn").style.display = "none";
    renderTables();
  }
}

function spendMoney() {
  const date = document.getElementById("cashOutdate").value;
  const reason = document.getElementById("cashOutReason").value;
  const amount = Number(document.getElementById("cashOutAmount").value);

  if (amount <= balance && date && reason && amount > 0) {
    balance -= amount;
    spent += amount;
    document.getElementById("balance").innerText = balance;
    document.getElementById("spent").innerText = spent;
    debitHistory.push({ date, reason, amount });
    document.getElementById("cashOutdate").value = "";
    document.getElementById("cashOutReason").value = "";
    document.getElementById("cashOutAmount").value = "";
    document.getElementById("debitbtn").style.display = "none";
    renderTables();
  } else {
    alert("Not enough money or invalid input!");
  }
}

function showHistory() {
  const section = document.getElementById("historySection");
  section.style.display = section.style.display === "block" ? "none" : "block";
  renderTables();
}

function renderTables(filtered = false) {
  const creditBody = document.getElementById("creditBody");
  const debitBody = document.getElementById("debitBody");
  creditBody.innerHTML = "";
  debitBody.innerHTML = "";

  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const creditFiltered = filtered
    ? filterByDate(creditHistory, from, to)
    : creditHistory;
  const debitFiltered = filtered
    ? filterByDate(debitHistory, from, to)
    : debitHistory;

  creditFiltered.forEach((item) => {
    creditBody.innerHTML += `<tr><td>${item.date}</td><td>${item.reason}</td><td>${item.amount}</td></tr>`;
  });
  debitFiltered.forEach((item) => {
    debitBody.innerHTML += `<tr><td>${item.date}</td><td>${item.reason}</td><td>${item.amount}</td></tr>`;
  });
}

function filterByDate(arr, from, to) {
  if (!from && !to) return arr;
  return arr.filter(
    (item) => (!from || item.date >= from) && (!to || item.date <= to)
  );
}

function filterHistory() {
  renderTables(true);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const creditFiltered = filterByDate(creditHistory, from, to);
  const debitFiltered = filterByDate(debitHistory, from, to);

  doc.text("Credit History", 10, y);
  y += 10;
  let creditTotal = 0;
  creditFiltered.forEach((item) => {
    doc.text(`${item.date} - ${item.reason} - Rs.${item.amount}`, 10, y);
    creditTotal += item.amount;
    y += 8;
  });

  y += 10;
  doc.text("Debit History", 10, y);
  y += 10;
  let debitTotal = 0;
  debitFiltered.forEach((item) => {
    doc.text(`${item.date} - ${item.reason} - Rs.${item.amount}`, 10, y);
    debitTotal += item.amount;
    y += 8;
  });

  y += 10;
  doc.text(`Total Credited: Rs.${creditTotal}`, 10, y);
  y += 8;
  doc.text(`Total Debited: Rs.${debitTotal}`, 10, y);

  doc.save("history.pdf");
}

function clearAll() {
  balance = 0;
  spent = 0;
  creditHistory.length = 0;
  debitHistory.length = 0;
  document.getElementById("balance").innerText = "0";
  document.getElementById("spent").innerText = "0";
  renderTables();
}
