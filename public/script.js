// script.js
import {
  initUserManagement,
  signIn,
  signUp,
  showSignUpInput,
  hideSignUpInput,
  logout,
} from "./user.js";
import {
  creditbtn,
  debitbtn,
  addMoney,
  spendMoney,
  filterHistory,
  downloadPDF,
  clearAll,
} from "./transactions.js";
import { showHistory, updateUI, showAppArea } from "./dom.js";
import { loadUserData } from "./storage.js";

// Helper function to safely add event listeners
function addListener(id, event, callback) {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener(event, callback);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initUserManagement();

  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    loadUserData(currentUser);
    showAppArea(currentUser);
    updateUI();
  }

  // Event listeners for login/signup
  addListener("showSignUpBtn", "click", showSignUpInput);
  addListener("cancelSignUp", "click", hideSignUpInput);
  addListener("signUpBtn", "click", signUp);
  addListener("signInBtn", "click", signIn);
  addListener("logoutBtn", "click", logout);

  // Event listeners for transactions
  addListener("credit", "click", creditbtn);
  addListener("debit", "click", debitbtn);
  addListener("addMoney", "click", addMoney);
  addListener("spendMoney", "click", spendMoney);

  // Event listeners for history
  addListener("history", "click", showHistory);
  addListener("filterBtn", "click", filterHistory);
  addListener("downloadBtn", "click", downloadPDF);
  addListener("clearBtn", "click", clearAll);
});

// Make functions available to HTML onclick attributes
window.creditbtn = creditbtn;
window.debitbtn = debitbtn;
window.addMoney = addMoney;
window.spendMoney = spendMoney;
window.showHistory = showHistory;
window.filterHistory = filterHistory;
window.downloadPDF = downloadPDF;
window.clearAll = clearAll;
window.showSignUpInput = showSignUpInput;
window.hideSignUpInput = hideSignUpInput;
window.signUp = signUp;
window.signIn = signIn;
window.logout = logout;
