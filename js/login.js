// Redirect if already logged in
if (
  localStorage.getItem("loggedIn") === "true" ||
  sessionStorage.getItem("loggedIn") === "true"
) {
  window.location.href = "/html/admin.html";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("rememberMe").checked;
  const errorMsg = document.getElementById("errorMsg");

  // Reset error state
  errorMsg.textContent = "";
  errorMsg.classList.remove("show");

  // Only check credentials if fields are filled
  if (!username || !password) {
    errorMsg.textContent = "Please fill in both fields.";
    errorMsg.classList.add("show");
    return;
  }

  // Validate credentials
  if (username === "admin" && password === "1234") {
    if (remember) {
      localStorage.setItem("loggedIn", "true");
    } else {
      sessionStorage.setItem("loggedIn", "true");
    }
    window.location.href = "/html/admin.html";
  } else {
    errorMsg.textContent = "❌ Invalid credentials.";
    errorMsg.classList.add("show");
  }
});
// Toggle password visibility
document
  .getElementById("togglePassword")
  .addEventListener("change", function () {
    const passwordInput = document.getElementById("password");
    passwordInput.type = this.checked ? "text" : "password";
  });
