/*
    Quiz Card Component

    USE: Used to display question during quizzes
    AUTHOR: Callum Firth
    DATE: 21/03/2026
*/

export function QuizCard(data, onAnswerSelect, selectedAnswer) {

    const {image, question, answers} = data; // Deconstructs properties from data

    const card = document.createElement("div"); // Create new div to contain the card elements
    card.classList.add("quiz-card")

    card.innerHTML =` 
        <img src="${image}" class="quiz_image"/>

        <p class="quiz_question">${question}</p>

        <div class="quiz_answers">
            ${answers.map((a,i) => `
                <button class="answer_btn ${selectedAnswer === i ?"selected" : ""}" data-index="${i}">
                    ${a}
                </button>
            `).join("")}
        </div>
    `; // adds all the required elements to the html page

    card.querySelectorAll(".answer_btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = Number(btn.dataset.index);
            onAnswerSelect(index);
        });
    });    

    return card;
}   