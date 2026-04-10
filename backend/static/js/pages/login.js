import { navigate } from "../main.js";

export function LoginPage() {

    const app = document.getElementById("app");
    app.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Login";
    title.classList.add("login_title");
    app.appendChild(title);

    const accLabel = document.createElement("label");
    accLabel.textContent = "Account Number";
    accLabel.classList.add("login_label");
    app.appendChild(accLabel);

    const accInput = document.createElement("input");
    accInput.type = "text";
    accInput.placeholder = "Enter account number";
    accInput.classList.add("login_input");
    app.appendChild(accInput);

    const passLabel = document.createElement("label");
    passLabel.textContent = "Password";
    passLabel.classList.add("login_label");
    app.appendChild(passLabel);

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Enter password";
    passInput.classList.add("login_input");
    app.appendChild(passInput);

    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.classList.add("login_btn");
    loginBtn.addEventListener("click", () => {
        const account = accInput.value.trim();
        const password = passInput.value.trim();

        // Authenticate and store returned user payload for later pages.
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

            // Local session state is persisted in browser storage.
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
        // Guest profile skips account-specific features like quiz creation.
        localStorage.setItem("user", JSON.stringify({ id: null, guest: true }));
        navigate("menu");
    });
    app.appendChild(guestBtn);

}
