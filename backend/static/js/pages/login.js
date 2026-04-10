import { navigate } from "../main.js";

export function LoginPage() {

    const app = document.getElementById("app");
    app.innerHTML = "";

    // Quizzler logo
    const logo = document.createElement("h1");
    logo.textContent = "Quizzler";
    logo.classList.add("login_logo");
    app.appendChild(logo);

    // Page title
    const title = document.createElement("h1");
    title.textContent = "Login";
    title.classList.add("login_title");
    app.appendChild(title);

    // Accounts label
    const accLabel = document.createElement("label");
    accLabel.textContent = "Account Number";
    accLabel.classList.add("login_label");
    app.appendChild(accLabel);

    // Accounts input
    const accInput = document.createElement("input");
    accInput.type = "text";
    accInput.placeholder = "Enter account number";
    accInput.classList.add("login_input");
    app.appendChild(accInput);

    // Passwords label
    const passLabel = document.createElement("label");
    passLabel.textContent = "Password";
    passLabel.classList.add("login_label");
    app.appendChild(passLabel);

    // Passwords input
    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Enter password";
    passInput.classList.add("login_input");
    app.appendChild(passInput);

    // Button to login
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.classList.add("login_btn");
    loginBtn.addEventListener("click", () => {
        const account = accInput.value.trim();
        const password = passInput.value.trim();

        // Authenticate and stores for later pages.
        fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_number: account, password: password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data));
            navigate("menu");
        });
    });

    app.appendChild(loginBtn);

    const createBtn = document.createElement("button");
    createBtn.textContent = "Create Account";
    createBtn.classList.add("login_btn");
    createBtn.addEventListener("click", () => navigate("create"));
    app.appendChild(createBtn);

    const guestBtn = document.createElement("button");
    guestBtn.textContent = "Play as Guest";
    guestBtn.classList.add("login_btn");
    guestBtn.addEventListener("click", () => {
        // Guest profile
        localStorage.setItem("user", JSON.stringify({ id: null, guest: true }));
        navigate("menu");
    });
    app.appendChild(guestBtn);

}
