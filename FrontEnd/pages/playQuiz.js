/*
    Play Quiz

    USE: The JavaScript used during the execution of a quiz
    AUTHOR: Callum Firth
    DATE: 22/03/2026
*/

import {QuizCard} from "../components/quizCard.js";

// Quick quiz for testing
/*const testQuiz ={
    title: "Test Title",
    questions: [
        {
            image: "https://placehold.co/300x200",
            question: "What is 4+4?",
            answers: ["1", "5", "9", "8"],
            correct: 3
        },
        {
            image: "https://placehold.co/300x200",
            question: "What is the capital of the UK?",
            answers: ["London", "Manchester", "Liverpool", "Brighton"],
            correct: 0
        },
        {
            image: "https://placehold.co/300x200",
            question: "What is the Red Planet?",
            answers: ["Earth", "Mars", "Venus", "Jupiter"],
            correct: 1
        }
    ]
};*/


export function PlayQuizPage() {

    const app = document.getElementById("app");

    let quiz = null;
    let loading = true;
    let current = 0; // Current question index
    let selectedAnswers = []; // Create an empty array for the selected answers

    // Fetch quiz from backend
    fetch("https://stunning-space-xylophone-pjwx9xwj7xg63rqj4-5000.app.github.dev/api/quizzes/1")
        .then(res => res.json())
        .then(data => {
            quiz = data;
            selectedAnswers = Array(quiz.questions.length).fill(null);
            loading = false;
            render();
        })
        .catch(err => {
            console.error("Failed to load quiz:", err);
            app.innerHTML = "<h2>Error loading quiz.</h2>";
        });


    function render() {
        app.innerHTML = ""; // clear page

        if (loading) {
            app.innerHTML = "<h2>Loading quiz...</h2>";
            return;
        }


        app.innerHTML = `<ion-icon name="person"></ion-icon>`;

        const title = document.createElement("h1");
        title.textContent = quiz.title;
        app.appendChild(title);

        const question = document.createElement("h2");
        question.textContent = `Question ${current + 1}`;
        app.appendChild(question);

        
        const card = QuizCard(
            quiz.questions[current],
            (selectedIndex)=> {
                selectedAnswers[current] = selectedIndex;
                render(); // Re-renders to highlight selected button
            },
            selectedAnswers[current]
        );

        app.appendChild(card);

        // Navigation Buttons
        const nav = document.createElement("div");
        nav.classList.add("quiz_nav");

        // Previous
        if (current > 0) {
            const backBtn = document.createElement("button");
            backBtn.textContent = "Previous";
            backBtn.classList.add("previous");
            backBtn.addEventListener("click", () => {
                current--;
                render()
            });
            nav.appendChild(backBtn);
        }

        // Next
        if (current < quiz.questions.length -1) {
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next";
            nextBtn.classList.add("next");
            nextBtn.addEventListener("click", () => {
                current++;
                render()
            });
            nav.appendChild(nextBtn);
        } else { // submit
            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";
            submitBtn.classList.add("submit");
            submitBtn.addEventListener("click", () => {
                console.log("Answers:", selectedAnswers);
                app.innerHTML="<h2>Quiz Completed</h2>";
                
            });
            nav.appendChild(submitBtn);
        }

        app.appendChild(nav);
    } 
      
    //render();
}