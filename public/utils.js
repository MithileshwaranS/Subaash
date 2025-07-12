// utils.js
export function showToast(type, message) {
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

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 5000);

  closeBtn.addEventListener("click", () => {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
}
