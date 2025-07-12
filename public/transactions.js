// transactions.js
import {
  getBalance,
  getSpent,
  getCreditHistory,
  getDebitHistory,
  setBalance,
  setSpent,
  setCreditHistory,
  setDebitHistory,
  saveUserData,
  clearUserData,
  filterByDate,
} from "./storage.js";
import { updateUI, renderTables } from "./dom.js";
import { showToast } from "./utils.js";

export function creditbtn() {
  document.getElementById("creditbtn").style.display = "block";
  document.getElementById("debitbtn").style.display = "none";
  document.getElementById("cashIndate").valueAsDate = new Date();
}

export function debitbtn() {
  document.getElementById("debitbtn").style.display = "block";
  document.getElementById("creditbtn").style.display = "none";
  document.getElementById("cashOutdate").valueAsDate = new Date();
}

export function addMoney() {
  const date = document.getElementById("cashIndate").value;
  const reason = document.getElementById("cashInReason").value.trim();
  const amount = Number(document.getElementById("cashInAmount").value);

  if (!date || !reason || isNaN(amount) || amount <= 0) {
    showToast("error", "Please fill all fields with valid values!");
    return;
  }

  setBalance(getBalance() + amount);
  const updatedCreditHistory = [
    ...getCreditHistory(),
    { date, reason, amount },
  ];
  setCreditHistory(updatedCreditHistory);
  updateUI();

  document.getElementById("cashIndate").value = "";
  document.getElementById("cashInReason").value = "";
  document.getElementById("cashInAmount").value = "";
  document.getElementById("creditbtn").style.display = "none";

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    saveUserData(currentUser);
  }

  showToast("success", `Successfully credited Rs.${amount}`);
}

export function spendMoney() {
  const date = document.getElementById("cashOutdate").value;
  const reason = document.getElementById("cashOutReason").value.trim();
  const amount = Number(document.getElementById("cashOutAmount").value);

  if (!date || !reason || isNaN(amount) || amount <= 0) {
    showToast("error", "Please fill all fields with valid values!");
    return;
  }

  if (amount > getBalance()) {
    showToast("error", "Not enough money!");
    return;
  }

  setBalance(getBalance() - amount);
  setSpent(getSpent() + amount);
  const updatedDebitHistory = [...getDebitHistory(), { date, reason, amount }];
  setDebitHistory(updatedDebitHistory);
  updateUI();

  document.getElementById("cashOutdate").value = "";
  document.getElementById("cashOutReason").value = "";
  document.getElementById("cashOutAmount").value = "";
  document.getElementById("debitbtn").style.display = "none";

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    saveUserData(currentUser);
  }

  showToast("success", `Successfully debited Rs.${amount}`);
}

export function filterHistory() {
  renderTables(true);
  showToast("success", "History filtered successfully");
}

export function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const creditFiltered = filterByDate(getCreditHistory(), from, to);
  const debitFiltered = filterByDate(getDebitHistory(), from, to);

  doc.setFontSize(18);
  doc.text("Transaction History", 10, y);
  y += 10;

  if (from || to) {
    doc.setFontSize(12);
    const rangeText = `${from ? "From: " + from : ""} ${to ? "To: " + to : ""}`;
    doc.text(rangeText, 10, y);
    y += 10;
  }

  doc.setFontSize(14);
  doc.text("Credit History", 10, y);
  y += 10;

  doc.setFontSize(12);
  let creditTotal = 0;
  creditFiltered.forEach((item) => {
    doc.text(`${item.date} - ${item.reason} - Rs.${item.amount}`, 10, y);
    creditTotal += item.amount;
    y += 8;
  });

  y += 10;
  doc.setFontSize(14);
  doc.text("Debit History", 10, y);
  y += 10;

  doc.setFontSize(12);
  let debitTotal = 0;
  debitFiltered.forEach((item) => {
    doc.text(`${item.date} - ${item.reason} - Rs.${item.amount}`, 10, y);
    debitTotal += item.amount;
    y += 8;
  });

  y += 10;
  doc.setFontSize(12);
  doc.text(`Total Credited: Rs.${creditTotal}`, 10, y);
  y += 8;
  doc.text(`Total Debited: Rs.${debitTotal}`, 10, y);
  y += 8;
  doc.text(`Current Balance: Rs.${getBalance()}`, 10, y);

  doc.save("transaction_history.pdf");
  showToast("success", "PDF downloaded successfully");
}

export function clearAll() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    clearUserData(currentUser);
    updateUI();
    showToast("success", "All data has been cleared");
  }
}
