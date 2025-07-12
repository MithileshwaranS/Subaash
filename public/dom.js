// dom.js
import {
  getBalance,
  getSpent,
  getCreditHistory,
  getDebitHistory,
  filterByDate,
} from "./storage.js";
import { showToast } from "./utils.js";

export function updateUI() {
  document.getElementById("balance").innerText = getBalance();
  document.getElementById("spent").innerText = getSpent();
  renderTables();
}

export function renderTables(filtered = false) {
  const creditBody = document.getElementById("creditBody");
  const debitBody = document.getElementById("debitBody");
  creditBody.innerHTML = "";
  debitBody.innerHTML = "";

  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const creditFiltered = filtered
    ? filterByDate(getCreditHistory(), from, to)
    : getCreditHistory();
  const debitFiltered = filtered
    ? filterByDate(getDebitHistory(), from, to)
    : getDebitHistory();

  creditFiltered.forEach((item) => {
    creditBody.innerHTML += `<tr><td>${item.date}</td><td>${item.reason}</td><td class="text-success">+${item.amount}</td></tr>`;
  });
  debitFiltered.forEach((item) => {
    debitBody.innerHTML += `<tr><td>${item.date}</td><td>${item.reason}</td><td class="text-danger">-${item.amount}</td></tr>`;
  });
}

export function showAppArea(username) {
  document.getElementById("loginpage").style.display = "none";
  document.getElementById("appArea").style.display = "block";
  document.getElementById("usernameDisplay").textContent = username;

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = today;

  document.getElementById("creditbtn").style.display = "none";
  document.getElementById("debitbtn").style.display = "none";
  document.getElementById("historySection").style.display = "none";
}

export function showHistory() {
  const section = document.getElementById("historySection");
  section.style.display = section.style.display === "block" ? "none" : "block";
  renderTables();
}

export function populateUserSelect(users) {
  const userSelect = document.getElementById("userSelect");
  userSelect.innerHTML = "";

  if (users.length === 0) {
    userSelect.innerHTML =
      '<option value="" disabled selected>No users found</option>';
    userSelect.disabled = true;
  } else {
    userSelect.innerHTML =
      '<option value="" disabled selected>Select a user</option>';
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user;
      option.textContent = user;
      userSelect.appendChild(option);
    });
    userSelect.disabled = false;
  }
}
