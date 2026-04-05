export function AdminHeader() {
    const header = document.createElement("header");
    header.classList.add("admin-header");

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

    header.appendChild(title);
    header.appendChild(userIcon);
    return header;
}
