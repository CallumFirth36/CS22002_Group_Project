/*
    Create Account Page

    USE: The JavaScript used for creating a new user account
    AUTHOR: Callum Firth
    DATE: 06/04/2026
*/
import { navigate } from "../main.js";

export function CreateAccountPage() {

    const app = document.getElementById("app");
    app.innerHTML = ""; // clear page
    
    const logo = document.createElement("h1");
    logo.textContent = "Quizzler";
    logo.classList.add("login_logo");
    app.appendChild(logo);

    // Title
    const title = document.createElement("h1");
    title.textContent = "Create Account";
    title.classList.add("create_title");
    app.appendChild(title);

    // Account Number Label
    const accLabel = document.createElement("label");
    accLabel.textContent = "Account Number";
    accLabel.classList.add("create_label");
    app.appendChild(accLabel);

    // Account Number Input
    const accInput = document.createElement("input");
    accInput.type = "text";
    accInput.placeholder = "Enter account number";
    accInput.classList.add("create_input");
    app.appendChild(accInput);

    // Password Label
    const passLabel = document.createElement("label");
    passLabel.textContent = "Password";
    passLabel.classList.add("create_label");
    app.appendChild(passLabel);

    // Password Input
    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.placeholder = "Enter password";
    passInput.classList.add("create_input");
    app.appendChild(passInput);

    // Create Account Button
    const createBtn = document.createElement("button");
    createBtn.textContent = "Create Account";
    createBtn.classList.add("create_btn");
    createBtn.addEventListener("click", () => {
        const account = accInput.value.trim();
        const password = passInput.value.trim();

        fetch("/api/accounts", {
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

            console.log("Account created:", data);
            alert("Account created successfully!");

            navigate("login");
        })
        .catch(err => console.error("Account creation failed:", err));
    });

    app.appendChild(createBtn);
}
