import { navigate } from "../main.js";

export function MenuPage() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    app.innerHTML = `<ion-icon name="person"></ion-icon>`;
    
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

    const createBtn = document.createElement("button");
    createBtn.textContent = "Create Quiz";
    createBtn.classList.add("create_quiz_button");
    createBtn.addEventListener("click", () => navigate("admin"));
    app.appendChild(createBtn);

    const search = document.createElement("input");
    search.id = "quizSearch";
    search.placeholder = "Search quizzes...";
    search.classList.add("quiz_search");
    app.appendChild(search);

    const list = document.createElement("ul");
    list.id = "quizList";
    list.classList.add("quiz_list");
    app.appendChild(list);

    loadUserQuizzes(userId, carousel, list);

    search.addEventListener("keyup", () => {
        const filter = search.value.toLowerCase();
        const items = list.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            const txt = items[i].textContent.toLowerCase();
            items[i].style.display = txt.includes(filter) ? "" : "none";
        }
    });
}

async function loadUserQuizzes(userId, carousel, list) {
    try {
        const res = await fetch(`/api/users/${userId}/quizzes`);
        const quizzes = await res.json();

        carousel.innerHTML = "";
        list.innerHTML = "";

        if (!quizzes.length) {
            const emptyCard = document.createElement("div");
            emptyCard.classList.add("card", "empty");
            emptyCard.textContent = "You have no quizzes yet";
            carousel.appendChild(emptyCard);

            const li = document.createElement("li");
            li.textContent = "You have no quizzes yet";
            li.classList.add("empty_row");
            list.appendChild(li);
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

    } catch (err) {
        console.error("Failed to load quizzes:", err);
    }
}
