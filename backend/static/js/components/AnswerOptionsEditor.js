export function AnswerOptionsEditor(answers, correctAnswerIndex, onAnswerChange, onCorrectAnswerSelect) {
    const wrapper = document.createElement("section");
    wrapper.classList.add("admin-form__section");

    const label = document.createElement("h4");
    label.classList.add("admin-form__label");
    label.textContent = "Possible answers";

    const list = document.createElement("div");
    list.classList.add("answer-list");

    answers.forEach((answerText, index) => {
        const row = document.createElement("div");
        row.classList.add("answer-list__row");

        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("admin-input", "answer-list__input");
        input.value = answerText;
        input.placeholder = `Answer ${index + 1}`;
        input.addEventListener("input", (event) => {
            onAnswerChange(index, event.target.value);
        });

        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("answer-list__star");
        if (index === correctAnswerIndex) {
            button.classList.add("answer-list__star--active");
        }
        button.textContent = index === correctAnswerIndex ? "★" : "☆";
        button.setAttribute("aria-label", `Mark answer ${index + 1} as correct`);
        button.addEventListener("click", () => onCorrectAnswerSelect(index));

        row.appendChild(input);
        row.appendChild(button);
        list.appendChild(row);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(list);
    return wrapper;
}
