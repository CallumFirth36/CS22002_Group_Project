/*
    Login Page

    USE: The JavaScript used for logging into an account
    AUTHOR: Callum Firth
    DATE: 06/04/2026
*/

import { navigate } from "../main.js";

export function LoginPage() {

    const app = document.getElementById("app");
    app.innerHTML = ""; // clear page

    // Title
    const title = document.createElement("h1");
    title.textContent = "Login";
    title.classList.add("login_title");
    app.appendChild(title);

    // Account Number Label
    const accLabel = document.createElement("label");
    accLabel.textContent = "Account Number";
    accLabel.classList.add("login_label");
    app.appendChild(accLabel);

    // Account Number Input
    const accInput = document.createElement("input");
    accInput.type = "text";
    accInput.placeholder = "Enter account number";
    accInput.classList.add("login_input");
    app.appendChild(accInput);

    // Password Label
    const passLabel = document.createElement("label");
    passLabel.textContent = "Password";
    passLabel.classList.add("login_label");
    app.appendChild(passLabel);

    // Password Input
    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Enter password";
    passInput.classList.add("login_input");
    app.appendChild(passInput);

    // Login Button
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.classList.add("login_btn");
    loginBtn.addEventListener("click", () => {
        const account = accInput.value.trim();
        const password = passInput.value.trim();

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

            console.log("Logged in:", data);

            // Store user info if needed
            localStorage.setItem("user", JSON.stringify(data));

            // Redirect based on role
            //if (data.role === "admin") {
            //    navigate("admin");   // once you build it
            //} else {
            //    navigate("play");
            //}
            navigate("menu");
        })
        .catch(err => console.error("Login failed:", err));
    });

    app.appendChild(loginBtn);

    // Create Account Button
    const createBtn = document.createElement("button");
    createBtn.textContent = "Create Account";
    createBtn.classList.add("login_btn");
    createBtn.addEventListener("click", () => {
        console.log("Create Account clicked");
        // TODO: Navigate to create account page
        navigate("create");
    });
    app.appendChild(createBtn);

    // Play as Guest Button
    const guestBtn = document.createElement("button");
    guestBtn.textContent = "Play as Guest";
    guestBtn.classList.add("login_btn");
    guestBtn.addEventListener("click", () => {
        console.log("Play as Guest clicked");
        navigate("admin");
    });
    app.appendChild(guestBtn);

    // Forgot Password Link
    const forgot = document.createElement("p");
    forgot.textContent = "Forgot Password?";
    forgot.classList.add("forgot_link");
    forgot.style.cursor = "pointer";
    forgot.addEventListener("click", () => {
        console.log("Forgot Password clicked");
        // TODO: Add forgot password logic
    });
    app.appendChild(forgot);
}
