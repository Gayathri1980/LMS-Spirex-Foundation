const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const bottomText = document.getElementById("bottomText");

function showLogin() {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Login to continue your learning journey";

    bottomText.innerHTML =
        "Don't have an account? <button type='button' id='bottomRegister'>Create Account</button>";

    document.getElementById("bottomRegister").onclick = showRegister;
}

function showRegister() {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Join SpireX and start your learning journey";

    bottomText.innerHTML =
        "Already have an account? <button type='button' id='bottomLogin'>Login</button>";

    document.getElementById("bottomLogin").onclick = showLogin;
}

loginTab.onclick = showLogin;
registerTab.onclick = showRegister;

function passwordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    button.onclick = function() {
        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
        } else {
            input.type = "password";
            button.textContent = "👁️";
        }
    };
}

passwordToggle("loginPassword", "loginEye");
passwordToggle("registerPassword", "registerEye");

loginForm.onsubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    localStorage.setItem("spirexLoginEmail", email);

    alert("Login successful! Welcome to SpireX Learning Platform.");
};

registerForm.onsubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const user = {
        name,
        email,
        password
    };

    localStorage.setItem("spirexUser", JSON.stringify(user));

    alert("Account created successfully.");

    registerForm.reset();

    showLogin();
};

document.getElementById("forgotPassword").onclick = function(event) {
    event.preventDefault();

    const email = prompt("Enter your registered email address:");

    if (email) {
        alert("Password reset request submitted for " + email);
    }
};