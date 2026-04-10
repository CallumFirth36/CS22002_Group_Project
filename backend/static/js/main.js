import { LoginPage } from "./pages/login.js";
import { CreateAccountPage } from "./pages/createAccount.js";
import { PlayQuizPage } from "./pages/playQuiz.js";
import { AdminPage } from "./pages/admin.js";
import { MenuPage } from "./pages/menu.js";

const routes = {
    login: LoginPage,
    create: CreateAccountPage,
    play: PlayQuizPage,
    admin: AdminPage,
    menu: MenuPage
};

export function navigate(page, data) {
    // Route keys map directly to page factory functions.
    const pageFunc = routes[page];
    if (!pageFunc) return;
    pageFunc(data);
}

// Start at Login
navigate("login");
