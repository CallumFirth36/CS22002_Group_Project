import { navigate } from "../main.js";

export function MenuPage() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    app.innerHTML = `<ion-icon name="person"></ion-icon>`;

    const icon = app.querySelector("ion-icon");
    icon.style.cursor = "pointer";

    icon.addEventListener("click", () => {
        const popup = document.createElement("div");
        popup.classList.add("logout_popup");

        popup.innerHTML = `
            <div class="logout_box">
                <p>Log out?</p>
                <button id="yesLogout">Yes</button>
                <button id="noLogout">No</button>
            </div>
        `;

        document.body.appendChild(popup);

        document.getElementById("yesLogout").addEventListener("click", () => {
            localStorage.removeItem("user");
            navigate("login");
            popup.remove();
        });

        document.getElementById("noLogout").addEventListener("click", () => {
            popup.remove();
        });
    });

    const title = document.createElement("h1");
    title.classList.add("quizzler_title");
    title.textContent = "Quizzler";
    app.appendChild(title);

    const yourQuizzes = document.createElement("h2");
    yourQuizzes.classList.add("your_quiz");
    yourQuizzes.textContent = "Your Quizzes";
    app.appendChild(yourQuizzes);

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    app.appendChild(carousel);

    if (!user?.guest) {
        const createBtn = document.createElement("button");
        createBtn.textContent = "Create Quiz";
        createBtn.classList.add("create_quiz_button");
        createBtn.addEventListener("click", () => navigate("admin"));
        app.appendChild(createBtn);
    }

    const search = document.createElement("input");
    search.id = "quizSearch";
    search.placeholder = "Search quizzes...";
    search.classList.add("quiz_search");
    app.appendChild(search);

    const list = document.createElement("ul");
    list.id = "quizList";
    list.classList.add("quiz_list");
    app.appendChild(list);

    if (user?.guest) {
        showEmptyCarousel(carousel);
    } else {
        loadUserQuizzes(userId, carousel);
    }

    loadAllQuizzes(list);

    search.addEventListener("keyup", () => {
        const filter = search.value.toLowerCase();
        const items = list.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            const txt = items[i].textContent.toLowerCase();
            items[i].style.display = txt.includes(filter) ? "" : "none";
        }
    });
}

function showEmptyCarousel(carousel) {
    carousel.innerHTML = "";
    const emptyCard = document.createElement("div");
    emptyCard.classList.add("card", "empty");
    emptyCard.textContent = "You have no quizzes yet";
    carousel.appendChild(emptyCard);
}

async function loadUserQuizzes(userId, carousel) {
    try {
        const res = await fetch(`/api/users/${userId}/quizzes`);
        const quizzes = await res.json();

        carousel.innerHTML = "";

        if (!quizzes.length) {
            const emptyCard = document.createElement("div");
            emptyCard.classList.add("card", "empty");
            emptyCard.textContent = "You have no quizzes yet";
            carousel.appendChild(emptyCard);
            return;
        }

        quizzes.forEach(q => {
            const card = document.createElement("div");
            card.classList.add("card");
            const title = document.createElement("p");
            title.textContent = q.title;
            card.appendChild(title);
            card.addEventListener("click", () => navigate("play", q.id));
            carousel.appendChild(card);
        });
    } catch (err) {}
}

async function loadAllQuizzes(list) {
    try {
        const res = await fetch(`/api/quizzes`);
        const quizzes = await res.json();

        list.innerHTML = "";

        if (!quizzes.length) {
            const li = document.createElement("li");
            li.textContent = "No quizzes found";
            li.classList.add("empty_row");
            list.appendChild(li);
            return;
        }

        quizzes.forEach(q => {
            const li = document.createElement("li");
            li.classList.add("quiz_row");
            const name = document.createElement("span");
            name.textContent = q.title;
            name.classList.add("quiz_name");
            const playBtn = document.createElement("button");
            playBtn.textContent = "Play";
            playBtn.classList.add("play_btn");
            playBtn.addEventListener("click", () => navigate("play", q.id));
            li.appendChild(name);
            li.appendChild(playBtn);
            list.appendChild(li);
        });
    } catch (err) {}
}
