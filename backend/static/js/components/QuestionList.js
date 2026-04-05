/*
    Question List Component

    USE: Display and select questions on admin page
    AUTHOR: Bailey Clark
    DATE: 23/03/2026
*/

export function QuestionList(
    questions,
    currentQuestionIndex,
    onSelectQuestion,
    onAddQuestion,
    onRemoveQuestion
) {
    const card = document.createElement("aside");
    card.classList.add("question-list");

    const title = document.createElement("h3");
    title.textContent = "Questions";
    title.classList.add("question-list__title");
    card.appendChild(title);

    const list = document.createElement("ul");
    list.classList.add("question-list__items");

    questions.forEach((question, index) => {
        const item = document.createElement("li");
        item.classList.add("question-list__item");

        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("question-list__button");
        if (index === currentQuestionIndex) {
            button.classList.add("question-list__button--active");
        }

        const dot = document.createElement("span");
        dot.classList.add("question-list__dot");
        dot.textContent = "•";

        const label = document.createElement("span");
        label.textContent = `Question ${index + 1}`;

        const star = document.createElement("span");
        star.classList.add("question-list__star");
        star.textContent = question.correctAnswerIndex !== null ? "★" : "☆";

        button.appendChild(dot);
        button.appendChild(label);
        button.appendChild(star);

        button.addEventListener("click", () => onSelectQuestion(index));

        item.appendChild(button);
        list.appendChild(item);
    });

    card.appendChild(list);

    const controls = document.createElement("div");
    controls.classList.add("question-list__controls");

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.classList.add("question-list__control-btn");
    addButton.textContent = "+ Add Question";
    addButton.addEventListener("click", onAddQuestion);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("question-list__control-btn", "question-list__control-btn--danger");
    removeButton.textContent = "Remove Question";
    removeButton.disabled = questions.length <= 1;
    removeButton.addEventListener("click", onRemoveQuestion);

    controls.appendChild(addButton);
    controls.appendChild(removeButton);
    card.appendChild(controls);

    return card;
}
