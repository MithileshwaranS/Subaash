let balance = 0;
let spent = 0;
const creditHistory = [];
const debitHistory = [];

// Toast notification function
function showToast(type, message) {
  const toastContainer = document.getElementById("toastContainer");
  const toastId = "toast-" + Date.now();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} show`;
  toast.id = toastId;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  const toastHeader = document.createElement("div");
  toastHeader.className = "toast-header";

  const strong = document.createElement("strong");
  strong.className = "me-auto";
  strong.textContent = type.charAt(0).toUpperCase() + type.slice(1);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn-close";
  closeBtn.setAttribute("data-bs-dismiss", "toast");
  closeBtn.setAttribute("aria-label", "Close");

  toastHeader.appendChild(strong);
  toastHeader.appendChild(closeBtn);

  const toastBody = document.createElement("div");
  toastBody.className = "toast-body";
  toastBody.textContent = message;

  toast.appendChild(toastHeader);
  toast.appendChild(toastBody);

  toastContainer.appendChild(toast);

  // Auto-remove toast after 5 seconds
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);

  // Manual close
  closeBtn.addEventListener("click", () => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
}

function login() {
  const name = document.getElementById("nameBox").value;
  if (name.trim() !== "") {
    document.getElementById("usernameDisplay").innerText = name;
    document.getElementById("appArea").style.display = "block";
    document.getElementById("loginpage").style.display = "none";
    showToast("success", `Welcome back, ${name}!`);
  } else {
    showToast("error", "Please enter your name!");
  }
}

function logout() {
  document.getElementById("appArea").style.display = "none";
  document.getElementById("loginpage").style.display = "flex";
  document.getElementById("nameBox").value = "";
  showToast("success", "Logged out successfully");
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
    showToast("success", `Successfully credited Rs.${amount}`);
  } else {
    showToast("error", "Please fill all fields with valid values!");
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
    showToast("success", `Successfully debited Rs.${amount}`);
  } else {
    showToast(
      "error",
      amount > balance ? "Not enough money!" : "Invalid input!"
    );
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
  showToast("success", "History filtered successfully");
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
  showToast("success", "PDF downloaded successfully");
}

function showClearConfirmation() {
  const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
  document.getElementById("confirmClear").onclick = function () {
    clearAll();
    modal.hide();
  };
  modal.show();
}

function clearAll() {
  balance = 0;
  spent = 0;
  creditHistory.length = 0;
  debitHistory.length = 0;
  document.getElementById("balance").innerText = "0";
  document.getElementById("spent").innerText = "0";
  renderTables();
  showToast("success", "All data has been cleared");
}
