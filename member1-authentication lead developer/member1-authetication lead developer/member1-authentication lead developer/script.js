
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const tabs = document.querySelectorAll(".tab");

function showLogin() {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
}

function showRegister() {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
}

function togglePassword() {
    const password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    alert("Login successful!");
});

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Account created successfully!");

    showLogin();
});
