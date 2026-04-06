/*
    Main SPA Router

    USE: Handles navigation between pages without reloading
    AUTHOR: Callum Firth
    DATE: 06/04/2026
*/

import { LoginPage } from "./pages/login.js";
import { CreateAccountPage } from "./pages/createAccount.js";
import { PlayQuizPage } from "./pages/playQuiz.js";
// import { AdminPage } from "./pages/admin.js";  // when you make it

// Map routes to page functions
const routes = {
    login: LoginPage,
    create: CreateAccountPage,
    play: PlayQuizPage,
    // admin: AdminPage
};

// Global navigation function
export function navigate(page) {
    const pageFunc = routes[page];

    if (!pageFunc) {
        console.error("Unknown page:", page);
        return;
    }

    pageFunc(); // Render the page
}

// Start on login page
navigate("login");
