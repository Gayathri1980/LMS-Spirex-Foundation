
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabs = document.querySelectorAll(".tab");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");
const passwordInput = document.getElementById("password");

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
}

function showLogin() {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    tabs.forEach(tab => {
        const active = tab.dataset.tab === "login";
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

function showRegister() {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    tabs.forEach(tab => {
        const active = tab.dataset.tab === "register";
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        if (tab.dataset.tab === "login") {
            showLogin();
        } else {
            showRegister();
        }
    });
});

document.getElementById("createAccount").addEventListener("click", showRegister);

document.getElementById("togglePassword").addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    this.textContent = isPassword ? "🙈" : "👁";
    this.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
    }

    showMessage(
        loginMessage,
        "The form is valid, but real login requires a connected authentication API.",
        "error"
    );
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
    }

    showMessage(
        registerMessage,
        "The form is valid, but account creation requires a connected backend.",
        "error"
    );
});

document.getElementById("forgotPassword").addEventListener("click", function () {
    showMessage(
        loginMessage,
        "Password recovery will be available after the authentication service is connected.",
        "error"
    );
});
