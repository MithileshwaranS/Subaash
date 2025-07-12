// storage.js
// Shared state
let balance = 0;
let spent = 0;
let creditHistory = [];
let debitHistory = [];

// Getter functions
export function getBalance() {
  return balance;
}
export function getSpent() {
  return spent;
}
export function getCreditHistory() {
  return creditHistory;
}
export function getDebitHistory() {
  return debitHistory;
}

// Setter functions
export function setBalance(value) {
  balance = value;
}
export function setSpent(value) {
  spent = value;
}
export function setCreditHistory(value) {
  creditHistory = value;
}
export function setDebitHistory(value) {
  debitHistory = value;
}

// Utility function
export function filterByDate(arr, from, to) {
  if (!from && !to) return arr;
  return arr.filter(
    (item) => (!from || item.date >= from) && (!to || item.date <= to)
  );
}

export function saveUserData(username) {
  const userData = {
    balance,
    spent,
    creditHistory,
    debitHistory,
  };
  localStorage.setItem(`userData_${username}`, JSON.stringify(userData));
}

export function loadUserData(username) {
  const userData = localStorage.getItem(`userData_${username}`);
  if (userData) {
    const data = JSON.parse(userData);
    balance = data.balance || 0;
    spent = data.spent || 0;
    creditHistory = data.creditHistory || [];
    debitHistory = data.debitHistory || [];
  }
  return { balance, spent, creditHistory, debitHistory };
}

export function clearUserData(username) {
  balance = 0;
  spent = 0;
  creditHistory = [];
  debitHistory = [];
  saveUserData(username);
}

export function loadUsernames() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function addUsername(username) {
  const users = loadUsernames();
  if (!users.includes(username)) {
    users.push(username);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }
  return false;
}
