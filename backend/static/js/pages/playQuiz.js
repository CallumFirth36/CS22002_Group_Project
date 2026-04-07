import { QuizCard } from "../components/quizCard.js";

export function PlayQuizPage(quizId) {
    const app = document.getElementById("app");

    let quiz = null;
    let loading = true;
    let current = 0;
    let selectedAnswers = [];

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

    function render() {
        app.innerHTML = "";

        if (loading) {
            app.innerHTML = "<h2>Loading quiz...</h2>";
            return;
        }

        app.innerHTML = `<ion-icon name="person"></ion-icon>`;

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
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.classList.add("submit");
            submitBtn.addEventListener("click", () => {
                app.innerHTML = "<h2>Quiz Completed</h2>";
            });
            nav.appendChild(submitBtn);
        }

        app.appendChild(nav);
    }
}
