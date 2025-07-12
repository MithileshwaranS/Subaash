// user.js
import {
  loadUsernames,
  addUsername,
  loadUserData,
  saveUserData,
  setBalance,
  setSpent,
  setCreditHistory,
  setDebitHistory,
} from "./storage.js";
import { showToast } from "./utils.js";
import { showAppArea, populateUserSelect, updateUI } from "./dom.js";

export function initUserManagement() {
  const users = loadUsernames();
  populateUserSelect(users);
}

export function showSignUpInput() {
  document.getElementById("signUpInputSection").style.display = "block";
  document.getElementById("showSignUpBtn").style.display = "none";
  document.getElementById("userListSection").style.display = "none";
}

export function hideSignUpInput() {
  document.getElementById("signUpInputSection").style.display = "none";
  document.getElementById("showSignUpBtn").style.display = "block";
  document.getElementById("userListSection").style.display = "block";
}

export function signUp() {
  const newUsername = document.getElementById("newUsername").value.trim();
  if (!newUsername) {
    showToast("error", "Please enter a username");
    return;
  }

  if (addUsername(newUsername)) {
    showToast("success", "User registered successfully!");
    document.getElementById("newUsername").value = "";
    hideSignUpInput();
    initUserManagement();
  } else {
    showToast("error", "Username already exists. Please choose another.");
  }
}

export function signIn() {
  const userSelect = document.getElementById("userSelect");
  const selectedUser = userSelect.value;

  if (!selectedUser) {
    showToast("error", "Please select a username");
    return;
  }

  localStorage.setItem("currentUser", selectedUser);
  const { balance, spent, creditHistory, debitHistory } =
    loadUserData(selectedUser);
  setBalance(balance);
  setSpent(spent);
  setCreditHistory(creditHistory);
  setDebitHistory(debitHistory);
  showAppArea(selectedUser);
  updateUI();
  showToast("success", `Welcome back, ${selectedUser}!`);
}

export function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById("appArea").style.display = "none";
  document.getElementById("loginpage").style.display = "block";
  initUserManagement();
  showToast("success", "Logged out successfully");
}
