/*
    Question List Component

    USE: Used to display an interactive list of questions on the admin page
    AUTHOR: Bailey Clark
    DATE: 23/03/2026
*/
export function QuestionList(
    questions,
    currentQuestionIndex,
    onSelectQuestion,
    onAddQuestion,
    onRemoveQuestion,
    onQuestionCountChange
) {
    const panel = document.createElement("aside");
    panel.classList.add("question-list-panel");

    const heading = document.createElement("h2");
    heading.classList.add("question_list");
    heading.textContent = "Questions";

    const countWrap = document.createElement("div");
    countWrap.classList.add("admin-form__section");

    const countLabel = document.createElement("label");
    countLabel.classList.add("admin-form__label");
    countLabel.textContent = "Number of Questions";

    const countInput = document.createElement("input");
    countInput.type = "number";
    countInput.min = "1";
    countInput.max = "100";
    countInput.step = "1";
    countInput.value = String(questions.length);
    countInput.classList.add("admin-input", "question-list__count-input");
    countInput.addEventListener("change", (event) => {
        const nextValue = Number.parseInt(event.target.value, 10);
        if (Number.isNaN(nextValue)) {
            event.target.value = String(questions.length);
            return;
        }
        const bounded = Math.min(100, Math.max(1, nextValue));
        event.target.value = String(bounded);
        onQuestionCountChange(bounded);
    });

    countWrap.appendChild(countLabel);
    countWrap.appendChild(countInput);

    const list = document.createElement("div");
    list.classList.add("question-list-items");

    questions.forEach((_, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.classList.add("admin-chip");
        if (index === currentQuestionIndex) {
            btn.classList.add("admin-chip--active");
        }
        btn.textContent = `Question ${index + 1}`;
        btn.addEventListener("click", () => onSelectQuestion(index));
        list.appendChild(btn);
    });

    const actions = document.createElement("div");
    actions.classList.add("question-list-actions");

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.classList.add("admin-chip");
    addBtn.textContent = "+ Add";
    addBtn.addEventListener("click", onAddQuestion);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("admin-chip");
    removeBtn.textContent = "- Remove";
    removeBtn.disabled = questions.length <= 1;
    removeBtn.addEventListener("click", onRemoveQuestion);

    actions.appendChild(addBtn);
    actions.appendChild(removeBtn);

    panel.appendChild(heading);
    panel.appendChild(countWrap);
    panel.appendChild(list);
    panel.appendChild(actions);
    return panel;
}
