/*
    Admin Header Component

    USE: Used to display the header of the admin page
    AUTHOR: Bailey Clark
    DATE: 10/04/2026
*/
export function AdminHeader() {
    const header = document.createElement("header");
    header.classList.add("admin-header");

    const homeButton = document.createElement("button");
    homeButton.type = "button";
    homeButton.classList.add("admin-header__home");
    homeButton.setAttribute("aria-label", "Go to menu");
    homeButton.textContent = "Menu";

    const title = document.createElement("h1");
    title.classList.add("admin-header__title");
    title.textContent = "Create Quiz";
    
    const userIcon = document.createElement("button");
    userIcon.type = "button";
    userIcon.classList.add("admin-header__user");
    userIcon.setAttribute("aria-label", "Admin profile");
    userIcon.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"></path>
        </svg>
    `;

    // Keep structure predictable for page-level event binding.
    header.appendChild(homeButton);
    header.appendChild(title);
    header.appendChild(userIcon);
    return header;
}
