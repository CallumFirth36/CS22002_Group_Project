import { QuizCard } from "../components/quizCard.js";
import { navigate } from "../main.js";

export function PlayQuizPage(quizId) {
    const app = document.getElementById("app");

    let quiz = null;
    let loading = true;
    let current = 0;
    let selectedAnswers = [];

    // Fetch selected quiz once, then drive UI from local state.
    fetch(`/api/quizzes/${quizId}`)
        .then(res => res.json())
        .then(data => {
            quiz = data;
            selectedAnswers = Array(quiz.questions.length).fill(null);
            loading = false;
            render();
        })
        .catch(() => {
            app.innerHTML = "<h2>Error loading quiz.</h2>";
        });

    function finishQuiz() {
        app.innerHTML = "";

        let score = 0;
        quiz.questions.forEach((q, i) => {
            // Stored selected index is compared against API-provided correct index.
            if (selectedAnswers[i] === q.correct) score++;
        });

        const result = document.createElement("h2");
        result.textContent = `You scored ${score} / ${quiz.questions.length}`;
        app.appendChild(result);

        const btn = document.createElement("button");
        btn.textContent = "Return to Menu";
        btn.classList.add("submit");
        btn.addEventListener("click", () => navigate("menu"));
        app.appendChild(btn);
    }

    function render() {
        app.innerHTML = "";

        if (loading) {
            app.innerHTML = "<h2>Loading quiz...</h2>";
            return;
        }

        app.innerHTML = `<ion-icon name="person"></ion-icon>`;

        const icon = app.querySelector("ion-icon");
        icon.style.cursor = "pointer";

        icon.addEventListener("click", () => {
            // Keep logout behavior consistent with menu/admin pages.
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
        title.classList.add("quiz_title");
        title.textContent = quiz.title;
        app.appendChild(title);

        const question = document.createElement("h2");
        question.classList.add("quiz_question_num");
        question.textContent = `Question ${current + 1}`;
        app.appendChild(question);

        const card = QuizCard(
            quiz.questions[current],
            (selectedIndex) => {
                // Persist answer per question so back/next navigation keeps selections.
                selectedAnswers[current] = selectedIndex;
                render();
            },
            selectedAnswers[current]
        );

        app.appendChild(card);

        const nav = document.createElement("div");
        nav.classList.add("quiz_nav");

        if (current > 0) {
            const backBtn = document.createElement("button");
            backBtn.textContent = "Previous";
            backBtn.classList.add("previous");
            backBtn.addEventListener("click", () => {
                current--;
                render();
            });
            nav.appendChild(backBtn);
        }

        if (current < quiz.questions.length - 1) {
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next";
            nextBtn.classList.add("next");
            nextBtn.addEventListener("click", () => {
                current++;
                render();
            });
            nav.appendChild(nextBtn);
        } else {
            // On final question, replace "Next" with a score submission action.
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.classList.add("submit");
            submitBtn.addEventListener("click", finishQuiz);
            nav.appendChild(submitBtn);
        }

        app.appendChild(nav);
    }
}
